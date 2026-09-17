const Brand = require("../model/brandModel");
const Brandupload = require("../utils/brandUploads");
const editupload = require("../utils/EditUploads");
const cloudinaryService = require("../services/cloudinaryService");

const createBrand = async (req, res) => {
  Brandupload(req, res, async (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "File upload failed", error: err.message });
    }

    let uploadedAsset = null;

    try {
      const { title, description, color } = req.body;

      // Single file upload via Cloudinary
      if (req.file) {
        uploadedAsset = await cloudinaryService.uploadSingle(
          req.file,
          "automall/brands",
        );
      } else if (req.files && req.files.length > 0) {
        uploadedAsset = await cloudinaryService.uploadSingle(
          req.files[0],
          "automall/brands",
        );
      }

      if (!uploadedAsset) {
        return res
          .status(400)
          .json({ success: false, message: "No photo uploaded" });
      }

      // Create a new brand with Cloudinary URL and public_id
      const newBrand = new Brand({
        photo: uploadedAsset.url,
        photoPublicId: uploadedAsset.public_id,
        title,
        color,
        description,
      });

      await newBrand.save();
      res.status(201).json({
        success: true,
        message: "Brand created successfully",
        brand: newBrand,
      });
    } catch (error) {
      // Rollback newly uploaded Cloudinary image if DB save fails
      if (uploadedAsset && uploadedAsset.public_id) {
        await cloudinaryService.deleteImage(uploadedAsset.public_id);
      }
      res.status(500).json({
        success: false,
        message: "Failed to create brand",
        error: error.message,
      });
    }
  });
};

async function getAllBrands(req, res) {
  try {
    const brands = await Brand.find().populate("product");
    if (!brands || brands.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No brands found" });
    }
    res.status(200).json({ success: true, brands });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve brands",
      error: error.message,
    });
  }
}

async function getBrandById(req, res) {
  try {
    const { id } = req.params;
    const brand = await Brand.findById(id).populate("product");

    if (!brand) {
      return res
        .status(404)
        .json({ success: false, message: "Brand not found" });
    }

    res.status(200).json({ success: true, brand });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve brand",
      error: error.message,
    });
  }
}

async function editBrand(req, res) {
  editupload(req, res, async (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "File upload failed", error: err.message });
    }

    let newUploadedAsset = null;

    try {
      const { id } = req.params;
      const { title, color } = req.body;

      // Find the existing brand
      const brand = await Brand.findById(id);
      if (!brand) {
        return res
          .status(404)
          .json({ success: false, message: "Brand not found" });
      }

      const oldPhoto = brand.photo;
      const oldPhotoPublicId = brand.photoPublicId;

      // If a new photo is uploaded: upload to Cloudinary first
      const fileToUpload =
        req.file || (req.files && req.files.length > 0 ? req.files[0] : null);
      if (fileToUpload) {
        newUploadedAsset = await cloudinaryService.uploadSingle(
          fileToUpload,
          "automall/brands",
        );
      }

      // Update the brand document
      const updatedBrand = await Brand.findByIdAndUpdate(
        id,
        {
          title: title || brand.title,
          color: color || brand.color,
          photo: newUploadedAsset ? newUploadedAsset.url : brand.photo,
          photoPublicId: newUploadedAsset
            ? newUploadedAsset.public_id
            : brand.photoPublicId,
        },
        { new: true },
      );

      // After successful update, delete old photo from Cloudinary (or local filesystem)
      if (newUploadedAsset && (oldPhotoPublicId || oldPhoto)) {
        await cloudinaryService.deleteImage(oldPhotoPublicId || oldPhoto);
      }

      res.status(200).json({
        success: true,
        message: "Brand updated successfully",
        brand: updatedBrand,
      });
    } catch (error) {
      // Rollback new asset if update fails
      if (newUploadedAsset && newUploadedAsset.public_id) {
        await cloudinaryService.deleteImage(newUploadedAsset.public_id);
      }
      res.status(500).json({
        success: false,
        message: "Failed to update brand",
        error: error.message,
      });
    }
  });
}

const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the brand by ID
    const brand = await Brand.findById(id);
    if (!brand) {
      return res
        .status(404)
        .json({ success: false, message: "Brand not found" });
    }

    // Delete the brand's photo from Cloudinary or legacy filesystem
    if (brand.photoPublicId || brand.photo) {
      await cloudinaryService.deleteImage(brand.photoPublicId || brand.photo);
    }

    // Delete the brand from the database
    await Brand.findByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: "Brand deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete brand",
      error: error.message,
    });
  }
};

module.exports = {
  createBrand,
  getAllBrands,
  getBrandById,
  editBrand,
  deleteBrand,
};
