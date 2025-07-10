const fs = require("fs");
const path = require("path");

const uploadProductModel = require("../model/uploadProductModel");
const upload = require("../utils/multerConfig");
const prodcutUploads = require("../utils/prodcutUploads");
const brandModel = require("../model/brandModel");
const categoryModel = require("../model/categoryModel")
const subcategoryModel = require("../model/subCategoryModel")

async function uploadProduct(req, res) {
  prodcutUploads(req, res, async (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "File upload failed", error: err.message });
    }

    try {
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
        brand,
      } = req.body;

      const photoPaths = req.files.map((file) => file.path);

      const newProduct = new uploadProductModel({
        title,
        details,
        price,
        color,
        discountPrice,
        description,
        size,
        photo: photoPaths,
        category,
        subCategory,
        brand,
      });

      await newProduct.save();

      if (brand) {
        await brandModel.findByIdAndUpdate(
          brand,
          { $push: { product: newProduct._id } },
          { new: true, useFindAndModify: false }
        );
      }

      // Update the Category model with the new product ID if category exists
      if (category) {
        await categoryModel.findByIdAndUpdate(
          category,
          { $push: { product: newProduct._id } },
          { new: true, useFindAndModify: false }
        );
      }

      // Update the SubCategory model with the new product ID if subCategory exists
      if (subCategory) {
        await subcategoryModel.findByIdAndUpdate(
          subCategory,
          { $push: { product: newProduct._id } },
          { new: true, useFindAndModify: false }
        );
      }
   

      res.status(201).json({
        message: "Product uploaded successfully",
        product: newProduct,
      });
    } catch (error) {
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

    // Fetch the product by ID and populate category and subCategory fields if needed
    const product = await uploadProductModel
      .findById(id)
      .populate("category") // Populating category
      .populate("subCategory"); // Populating subcategory

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
  upload.array("photos")(req, res, async (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "File upload failed", error: err.message });
    }

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

      const removedPhotos = req.body.removedPhotos
        ? JSON.parse(req.body.removedPhotos)
        : [];
         const photoPaths = req.files
                ? req.files.map((file) => path.relative(path.resolve(__dirname, "../"), file.path).replace(/\\/g, "/"))
                : [];
      

      // Find the product to update
      const product = await uploadProductModel.findById(id);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Remove the deleted photos from the filesystem and product's photo array
      if (removedPhotos.length > 0) {
        removedPhotos.forEach((photoPath) => {
          const fullPath = path.join(__dirname, "../", photoPath);

          // Remove photo from the filesystem
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }

          // Remove photo from the database
          product.photo = product.photo.filter((p) => p !== photoPath);
        });
      }

      // Push new photos to the photo array
      if (photoPaths.length > 0) {
        product.photo.push(...photoPaths);
      }

      // Update other fields
      product.title = title;
      product.details = details;
      product.price = price;
      product.discountPrice = discountPrice;
      product.description = description;
      product.color = color;
      product.size = size;
      product.category = category;
      product.subCategory = subCategory;

      // Save the updated product
      await product.save();

      res.status(200).json({
        message: "Product updated successfully",
        product: product,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to update product", error: error.message });
    }
  });
}

async function deleteProduct(req, res) {
  try {
    const { id } = req.params;

    // Find the product by ID
    const product = await uploadProductModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete product photos from the uploads folder
    product.photo.forEach((photo) => {
      const photoPath = path.join(__dirname, "../", photo); // Construct the full path to the photo
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath); // Delete the photo
      }
    });

    // Delete the product from the database
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
    const { id } = req.params; // Product ID
    const { imageUrl } = req.body; // The URL of the image to be removed

    // Find the product by ID
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Ensure product.photo is an array
    if (!Array.isArray(product.photo)) {
      return res
        .status(400)
        .json({ message: "Product does not have any photos" });
    }

    // Get the image path from the imageUrl
    const imagePath = imageUrl.replace("https://server.Automallbangladesh.com/", "");

    // Check if the image exists in the product's photo array
    if (!product.photo.includes(imagePath)) {
      return res.status(400).json({ message: "Image not found in product" });
    }

    // Remove the image from the product's photo array
    product.photo = product.photo.filter((img) => img !== imagePath);

    // Save the updated product
    await product.save();

    // Delete the image file from the server (optional)
    const fullImagePath = path.join(__dirname, `../uploads/${imagePath}`);
    fs.unlink(fullImagePath, (err) => {
      if (err) {
        console.error("Failed to delete image file:", err);
        // Don't return an error here, as the product has already been updated
      }
    });

    return res.status(200).json({ message: "Image removed successfully" });
  } catch (error) {
    console.error("Error removing image:", error);
    return res
      .status(500)
      .json({ message: "Failed to delete product", error: error.message });
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
