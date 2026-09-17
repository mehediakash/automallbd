const uploadProductModel = require("../model/uploadProductModel");
const upload = require("../utils/multerConfig");
const prodcutUploads = require("../utils/prodcutUploads");
const brandModel = require("../model/brandModel");
const categoryModel = require("../model/categoryModel");
const subcategoryModel = require("../model/subCategoryModel");
const cloudinaryService = require("../services/cloudinaryService");

async function uploadProduct(req, res) {
  prodcutUploads(req, res, async (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "File upload failed", error: err.message });
    }

    let uploadedAssets = [];

    try {
      const {
        title,
        details,
        price,
        discountPrice,
        description,
        category,
        subCategory,
        brand,
      } = req.body;

      let rawSize = req.body.size || req.body["size[]"] || [];
      if (typeof rawSize === "string") rawSize = [rawSize];
      const normalizedSize = Array.isArray(rawSize)
        ? rawSize.filter((s) => typeof s === "string" && s.trim().length > 0)
        : [];

      let rawColor = req.body.color || req.body["color[]"] || [];
      if (typeof rawColor === "string") rawColor = [rawColor];
      const normalizedColor = Array.isArray(rawColor)
        ? rawColor.filter((c) => typeof c === "string" && c.trim().length > 0)
        : [];

      // Upload images to Cloudinary
      if (req.files && req.files.length > 0) {
        uploadedAssets = await cloudinaryService.uploadMultiple(
          req.files,
          "automall/products",
        );
      }

      const photoUrls = uploadedAssets.map((asset) => asset.url);
      const photoPublicIds = uploadedAssets.map((asset) => asset.public_id);

      const newProduct = new uploadProductModel({
        title,
        details,
        price,
        color: normalizedColor,
        discountPrice,
        description,
        size: normalizedSize,
        photo: photoUrls,
        photoPublicIds: photoPublicIds,
        category,
        subCategory,
        brand,
      });

      await newProduct.save();

      if (brand) {
        await brandModel.findByIdAndUpdate(
          brand,
          { $push: { product: newProduct._id } },
          { new: true, useFindAndModify: false },
        );
      }

      // Update Category model
      if (category) {
        await categoryModel.findByIdAndUpdate(
          category,
          { $push: { product: newProduct._id } },
          { new: true, useFindAndModify: false },
        );
      }

      // Update SubCategory model
      if (subCategory) {
        await subcategoryModel.findByIdAndUpdate(
          subCategory,
          { $push: { product: newProduct._id } },
          { new: true, useFindAndModify: false },
        );
      }

      res.status(201).json({
        message: "Product uploaded successfully",
        product: newProduct,
      });
    } catch (error) {
      // Roll back uploaded Cloudinary images if DB save fails
      if (uploadedAssets.length > 0) {
        await cloudinaryService.deleteMultiple(
          uploadedAssets.map((asset) => asset.public_id),
        );
      }
      res
        .status(500)
        .json({ message: "Failed to upload product", error: error.message });
    }
  });
}

async function getAllProduct(req, res) {
  try {
    const products = await uploadProductModel
      .find()
      .populate("category", "name")
      .populate("subCategory", "name")
      .populate("brand");
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

async function getproduct(req, res) {
  try {
    const { id } = req.params;

    const product = await uploadProductModel
      .findById(id)
      .populate("category")
      .populate("subCategory");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get product", error: error.message });
  }
}

async function editProduct(req, res) {
  upload.any()(req, res, async (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "File upload failed", error: err.message });
    }

    let newUploads = [];

    try {
      const { id } = req.params;
      const {
        title,
        details,
        price,
        discountPrice,
        description,
        color,
        size,
        category,
        subCategory,
      } = req.body;

      // Find product to update
      const product = await uploadProductModel.findById(id);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const removedPhotos = req.body.removedPhotos
        ? JSON.parse(req.body.removedPhotos)
        : [];

      // 1. Upload new photos to Cloudinary first
      if (req.files && req.files.length > 0) {
        newUploads = await cloudinaryService.uploadMultiple(
          req.files,
          "automall/products",
        );
      }

      // 2. Remove deleted photos from Cloudinary/filesystem and product's arrays
      if (removedPhotos.length > 0) {
        for (const photoPath of removedPhotos) {
          await cloudinaryService.deleteImage(photoPath);

          const index = product.photo.indexOf(photoPath);
          if (index !== -1) {
            product.photo.splice(index, 1);
            if (product.photoPublicIds && product.photoPublicIds[index]) {
              product.photoPublicIds.splice(index, 1);
            }
          }
        }
      }

      // 3. Push new photo URLs and public_ids
      if (newUploads.length > 0) {
        product.photo.push(...newUploads.map((u) => u.url));
        if (!product.photoPublicIds) {
          product.photoPublicIds = [];
        }
        product.photoPublicIds.push(...newUploads.map((u) => u.public_id));
      }

      // 4. Update other fields
      if (title !== undefined) product.title = title;
      if (details !== undefined) product.details = details;
      if (price !== undefined) product.price = price;
      if (discountPrice !== undefined) product.discountPrice = discountPrice;
      if (description !== undefined) product.description = description;

      if (req.body.color !== undefined || req.body["color[]"] !== undefined) {
        let rawColor = req.body.color || req.body["color[]"] || [];
        if (typeof rawColor === "string") rawColor = [rawColor];
        product.color = Array.isArray(rawColor)
          ? rawColor.filter((c) => typeof c === "string" && c.trim().length > 0)
          : [];
      }

      if (req.body.size !== undefined || req.body["size[]"] !== undefined) {
        let rawSize = req.body.size || req.body["size[]"] || [];
        if (typeof rawSize === "string") rawSize = [rawSize];
        product.size = Array.isArray(rawSize)
          ? rawSize.filter((s) => typeof s === "string" && s.trim().length > 0)
          : [];
      }

      if (category !== undefined) product.category = category;
      if (subCategory !== undefined) product.subCategory = subCategory;

      // Save updated product
      await product.save();

      res.status(200).json({
        message: "Product updated successfully",
        product: product,
      });
    } catch (error) {
      // Roll back new Cloudinary uploads if update fails
      if (newUploads.length > 0) {
        await cloudinaryService.deleteMultiple(
          newUploads.map((u) => u.public_id),
        );
      }
      res
        .status(500)
        .json({ message: "Failed to update product", error: error.message });
    }
  });
}

async function deleteProduct(req, res) {
  try {
    const { id } = req.params;

    const product = await uploadProductModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete associated photos (handles Cloudinary assets and legacy local files)
    const photosToDelete =
      product.photoPublicIds && product.photoPublicIds.length > 0
        ? product.photoPublicIds
        : product.photo;

    if (photosToDelete && photosToDelete.length > 0) {
      await cloudinaryService.deleteMultiple(photosToDelete);
    }

    // Delete product from DB
    await uploadProductModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete product", error: error.message });
  }
}

const removeImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl } = req.body;

    const product = await uploadProductModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!Array.isArray(product.photo)) {
      return res
        .status(400)
        .json({ message: "Product does not have any photos" });
    }

    const index = product.photo.indexOf(imageUrl);
    if (index === -1) {
      return res.status(400).json({ message: "Image not found in product" });
    }

    // Remove from arrays
    product.photo.splice(index, 1);
    let publicId = null;
    if (product.photoPublicIds && product.photoPublicIds[index]) {
      publicId = product.photoPublicIds[index];
      product.photoPublicIds.splice(index, 1);
    }

    await product.save();

    // Delete asset from Cloudinary or local disk
    await cloudinaryService.deleteImage(publicId || imageUrl);

    return res.status(200).json({ message: "Image removed successfully" });
  } catch (error) {
    console.error("Error removing image:", error);
    return res
      .status(500)
      .json({ message: "Failed to remove image", error: error.message });
  }
};

module.exports = {
  uploadProduct,
  getAllProduct,
  editProduct,
  deleteProduct,
  getproduct,
  removeImage,
};
