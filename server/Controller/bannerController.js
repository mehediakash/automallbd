const Banner = require("../model/bannerModel");
const upload = require("../utils/multerConfig"); // Assuming you have multer config
const fs = require("fs");
const path = require("path");

const bannerUpload = async (req, res) => {
  try {
    const uploadFiles = upload.array("photo", 10); // Accept up to 10 files

    uploadFiles(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: "File upload failed", error: err.message });
      }

      const { position, link } = req.body;
      if (!position || !link) {
        return res.status(400).json({ message: "Position and link are required" });
      }

      const photoPaths = req.files
        ? req.files.map((file) => path.relative(path.resolve(__dirname, "../"), file.path).replace(/\\/g, "/"))
        : [];
      const newBanner = new Banner({ photo: photoPaths, position, link });

      await newBanner.save();
      res.status(201).json({ message: "Banner uploaded successfully", banner: newBanner });
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to upload banner", error: error.message });
  }
};

async function getAllbanner (req, res){
    try {
      // Fetch all banners from the database
      const banners = await Banner.find();
  
      // Check if any banners are found
      if (!banners || banners.length === 0) {
        return res.status(404).json({ message: "No banners found" });
      }
  
      // Return the banners
      res.status(200).json({ message: "Banners retrieved successfully", banners });
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve banners", error: error.message });
    }
  };

async function getABanner(req, res){
  try{
    let {id} = req.params
    const banner = await Banner.findById(id)
    if(!banner){
      return res.status(404).json({error: "This banner not found"})
    }
    res.status(200).json({success:true, banner})

  }catch(error){
    res.status(500).json({massage: "failed to retrieve Banners" , error: error.message})
  }

}
async function editBanner (req, res){
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ message: "File upload failed", error: err.message });
      }
  
      try {
        const { id } = req.params;
        const { position, link } = req.body;
  
        // Find the existing banner by ID
        const banner = await Banner.findById(id);
        if (!banner) {
          return res.status(404).json({ message: "Banner not found" });
        }
  
        // Collect the new file paths for uploaded photos, if any
        const newPhotoPaths = req.files ? req.files.map(file => file.path) : null;
  
        // If new photos are uploaded, delete old photos
        if (newPhotoPaths) {
          banner.photo.forEach(photo => {
            const photoPath = path.join(__dirname, "../", photo);
            if (fs.existsSync(photoPath)) {
              fs.unlinkSync(photoPath); // Delete the old photo
            }
          });
        }
  
        // Update the banner
        const updatedBanner = await Banner.findByIdAndUpdate(
          id,
          {
            photo: newPhotoPaths || banner.photo, // Replace photos if new ones are uploaded
            position,
            link,
          },
          { new: true }
        );
  
        res.status(200).json({ message: "Banner updated successfully", banner: updatedBanner });
      } catch (error) {
        res.status(500).json({ message: "Failed to update banner", error: error.message });
      }
    });
  };

async function deleteBanner(req, res){
    try {
      const { id } = req.params;
      const banner = await Banner.findById(id);
      if (!banner) {
        return res.status(404).json({ message: "Banner not found" });
      }
  
      // Delete banner photos from the uploads folder
      banner.photo.forEach(photo => {
        const photoPath = path.join(__dirname, "../", photo);
        if (fs.existsSync(photoPath)) {
          fs.unlinkSync(photoPath); // Delete the photo
        }
      });
  
      // Delete the banner from the database
      await Banner.findByIdAndDelete(id);
  
      res.status(200).json({ message: "Banner deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete banner", error: error.message });
    }
};

module.exports = {bannerUpload,editBanner, getAllbanner,deleteBanner,getABanner}