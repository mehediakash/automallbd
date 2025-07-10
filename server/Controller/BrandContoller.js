const Brand = require("../model/brandModel");
const Brandupload = require("../utils/brandUploads");
const editupload = require("../utils/EditUploads");
const fs = require("fs");
const path = require("path");


const createBrand = async (req, res) => {
    Brandupload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ message: "File upload failed", error: err.message });
        }

        try {
            const { title, description, color } = req.body;
            const photoPath = req.file ? req.file.path : null; // Single file upload

            if (!photoPath) {
                return res.status(400).json({ success: false, message: "No photo uploaded" });
            }

            // Create a new brand
            const newBrand = new Brand({
                photo: photoPath, // Store the photo path
                title,
                color,
                description,
            });

            await newBrand.save();
            res.status(201).json({ success: true, message: "Brand created successfully", brand: newBrand });
        } catch (error) {
            res.status(500).json({ success: false, message: "Failed to create brand", error: error.message });
        }
    });
};


async function getAllBrands(req, res) {
    try {
        const brands = await Brand.find().populate('product'); 
        if (!brands || brands.length === 0) {
            return res.status(404).json({ success: false, message: "No brands found" });
        }
        res.status(200).json({ success: true, brands });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to retrieve brands", error: error.message });
    }
}

async function getBrandById(req, res) {
    try {
        const { id } = req.params;
        const brand = await Brand.findById(id).populate('product'); 

        if (!brand) {
            return res.status(404).json({ success: false, message: "Brand not found" });
        }

        res.status(200).json({ success: true, brand });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to retrieve brand", error: error.message });
    }
}

async function editBrand(req, res) {
    editupload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ message: "File upload failed", error: err.message });
        }

        try {
            const { id } = req.params;
            const { title,color } = req.body;

            // Find the existing brand
            const brand = await Brand.findById(id);

            if (!brand) {
                return res.status(404).json({ success: false, message: "Brand not found" });
            }

            // Handle photo update if a new one is uploaded
            let photoPath = brand.photo; // Keep the existing photo if not uploading a new one
            if (req.files && req.files.length > 0) {
                // Delete old photo if exists
                if (photoPath) {
                    const oldPhotoPath = path.join(__dirname, "../", photoPath);
                    fs.unlink(oldPhotoPath, (err) => {
                        if (err) {
                            console.error("Error deleting old photo:", err);
                        }
                    });
                }

                // Set the new photo path
                photoPath = req.files.map(file => file.path)[0]; // Assuming only 1 photo for brand
            }

            // Update the brand document
            const updatedBrand = await Brand.findByIdAndUpdate(
                id,
                {
                    title: title || brand.title,
                    color: color || brand.color,
                    photo: photoPath || brand.photo, // Only update photo if it's new
                },
                { new: true }
            );

            res.status(200).json({
                success: true,
                message: "Brand updated successfully",
                brand: updatedBrand,
            });
        } catch (error) {
            res.status(500).json({ success: false, message: "Failed to update brand", error: error.message });
        }
    });
}



const deleteBrand = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the brand by ID
        const brand = await Brand.findById(id);
        if (!brand) {
            return res.status(404).json({ success: false, message: "Brand not found" });
        }

        // Delete the brand's photo from the uploads folder
        if (brand.photo) {
            const photoPath = path.join(__dirname, "../", brand.photo); // Adjust the path as needed
            fs.unlink(photoPath, (err) => {
                if (err) {
                    console.error("Error deleting photo:", err);
                }
            });
        }

        // Delete the brand from the database
        await Brand.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: "Brand deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete brand", error: error.message });
    }
};

module.exports = { createBrand , getAllBrands, getBrandById, editBrand, deleteBrand };
