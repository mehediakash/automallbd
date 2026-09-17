const Banner = require("../model/bannerModel");
const upload = require("../utils/multerConfig");
const cloudinaryService = require("../services/cloudinaryService");

const bannerUpload = async (req, res) => {
  try {
    const uploadFiles = upload.array("photo", 10); // Accept up to 10 files in memory

    uploadFiles(req, res, async (err) => {
      if (err) {
        return res
          .status(400)
          .json({ message: "File upload failed", error: err.message });
      }

      const { position, link } = req.body;
      if (!position || !link) {
        return res
          .status(400)
          .json({ message: "Position and link are required" });
      }

      let uploadedAssets = [];

      try {
        if (req.files && req.files.length > 0) {
          uploadedAssets = await cloudinaryService.uploadMultiple(
            req.files,
            "automall/banners",
          );
        }

        const photoUrls = uploadedAssets.map((asset) => asset.url);
        const photoPublicIds = uploadedAssets.map((asset) => asset.public_id);

        const newBanner = new Banner({
          photo: photoUrls,
          photoPublicIds: photoPublicIds,
          position,
          link,
        });

        await newBanner.save();
        res.status(201).json({
          message: "Banner uploaded successfully",
          banner: newBanner,
        });
      } catch (saveError) {
        // Rollback uploaded Cloudinary images if DB save fails
        if (uploadedAssets.length > 0) {
          await cloudinaryService.deleteMultiple(
            uploadedAssets.map((asset) => asset.public_id),
          );
        }
        throw saveError;
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to upload banner", error: error.message });
  }
};

async function getAllbanner(req, res) {
  try {
    const banners = await Banner.find();

    if (!banners || banners.length === 0) {
      return res.status(404).json({ message: "No banners found" });
    }

    res
      .status(200)
      .json({ message: "Banners retrieved successfully", banners });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve banners", error: error.message });
  }
}

async function getABanner(req, res) {
  try {
    const { id } = req.params;
    const banner = await Banner.findById(id);
    if (!banner) {
      return res.status(404).json({ error: "This banner not found" });
    }
    res.status(200).json({ success: true, banner });
  } catch (error) {
    res
      .status(500)
      .json({ massage: "failed to retrieve Banners", error: error.message });
  }
}

async function editBanner(req, res) {
  const uploadFiles = upload.array("photo", 10);

  uploadFiles(req, res, async (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "File upload failed", error: err.message });
    }

    let newUploadedAssets = [];

    try {
      const { id } = req.params;
      const { position, link } = req.body;

      // Find the existing banner by ID
      const banner = await Banner.findById(id);
      if (!banner) {
        return res.status(404).json({ message: "Banner not found" });
      }

      const oldPhotos = banner.photo;
      const oldPublicIds = banner.photoPublicIds;

      // 1. Upload new photos to Cloudinary first
      if (req.files && req.files.length > 0) {
        newUploadedAssets = await cloudinaryService.uploadMultiple(
          req.files,
          "automall/banners",
        );
      }

      const newPhotoUrls =
        newUploadedAssets.length > 0
          ? newUploadedAssets.map((asset) => asset.url)
          : null;
      const newPhotoPublicIds =
        newUploadedAssets.length > 0
          ? newUploadedAssets.map((asset) => asset.public_id)
          : null;

      // 2. Update the banner document
      const updatedBanner = await Banner.findByIdAndUpdate(
        id,
        {
          photo: newPhotoUrls || banner.photo,
          photoPublicIds: newPhotoPublicIds || banner.photoPublicIds,
          position: position || banner.position,
          link: link || banner.link,
        },
        { new: true },
      );

      // 3. If new photos were uploaded, delete old photos from Cloudinary or local disk
      if (newUploadedAssets.length > 0) {
        const toDelete =
          oldPublicIds && oldPublicIds.length > 0 ? oldPublicIds : oldPhotos;
        if (toDelete && toDelete.length > 0) {
          await cloudinaryService.deleteMultiple(toDelete);
        }
      }

      res.status(200).json({
        message: "Banner updated successfully",
        banner: updatedBanner,
      });
    } catch (error) {
      // Roll back newly uploaded assets if update fails
      if (newUploadedAssets.length > 0) {
        await cloudinaryService.deleteMultiple(
          newUploadedAssets.map((asset) => asset.public_id),
        );
      }
      res
        .status(500)
        .json({ message: "Failed to update banner", error: error.message });
    }
  });
}

async function deleteBanner(req, res) {
  try {
    const { id } = req.params;
    const banner = await Banner.findById(id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    // Delete photos from Cloudinary or local uploads folder
    const toDelete =
      banner.photoPublicIds && banner.photoPublicIds.length > 0
        ? banner.photoPublicIds
        : banner.photo;

    if (toDelete && toDelete.length > 0) {
      await cloudinaryService.deleteMultiple(toDelete);
    }

    if (banner.mobilePhotoPublicId || banner.mobilePhoto) {
      await cloudinaryService.deleteImage(
        banner.mobilePhotoPublicId || banner.mobilePhoto,
      );
    }

    // Delete banner from DB
    await Banner.findByIdAndDelete(id);

    res.status(200).json({ message: "Banner deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete banner", error: error.message });
  }
}

module.exports = {
  bannerUpload,
  editBanner,
  getAllbanner,
  deleteBanner,
  getABanner,
};
