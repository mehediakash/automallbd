const { Readable } = require("stream");
const fs = require("fs");
const path = require("path");
const cloudinary = require("../config/cloudinary");

/**
 * Upload a memory buffer directly to Cloudinary via stream
 * @param {Buffer} buffer - File buffer from multer memoryStorage
 * @param {string} folder - Target Cloudinary folder (e.g., 'automall/products')
 * @param {object} options - Additional Cloudinary upload options
 * @returns {Promise<{url: string, public_id: string}>}
 */
const uploadBuffer = (buffer, folder = "automall", options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder,
      resource_type: "auto",
      ...options,
    };

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });
      },
    );

    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    stream.pipe(uploadStream);
  });
};

/**
 * Upload a single file from multer memoryStorage
 * @param {object} file - req.file object
 * @param {string} folder - Target folder
 * @param {object} options - Extra options
 * @returns {Promise<{url: string, public_id: string}>}
 */
const uploadSingle = async (file, folder = "automall", options = {}) => {
  if (!file || !file.buffer) {
    throw new Error("No file buffer provided for upload");
  }
  return await uploadBuffer(file.buffer, folder, options);
};

/**
 * Upload multiple files from multer memoryStorage
 * @param {Array<object>} files - req.files array
 * @param {string} folder - Target folder
 * @param {object} options - Extra options
 * @returns {Promise<Array<{url: string, public_id: string}>>}
 */
const uploadMultiple = async (files, folder = "automall", options = {}) => {
  if (!files || !Array.isArray(files) || files.length === 0) {
    return [];
  }
  const uploadPromises = files.map((file) =>
    uploadBuffer(file.buffer, folder, options),
  );
  return await Promise.all(uploadPromises);
};

/**
 * Check if a URL or path is a Cloudinary URL
 * @param {string} url
 * @returns {boolean}
 */
const isCloudinaryUrl = (url) => {
  return typeof url === "string" && url.includes("cloudinary.com");
};

/**
 * Extract the Cloudinary public_id from a Cloudinary URL
 * @param {string} url - Full Cloudinary URL
 * @returns {string|null}
 */
const getPublicIdFromUrl = (url) => {
  if (!url || typeof url !== "string" || !isCloudinaryUrl(url)) {
    return null;
  }
  try {
    // Matches /upload/(optional transformations/)(optional v12345/)(public_id.ext)
    const match = url.match(/\/upload\/(?:[^\/]+\/)*?(?:v\d+\/)?([^\.]+)/);
    return match ? match[1] : null;
  } catch (err) {
    return null;
  }
};

/**
 * Delete an image by its public_id or URL.
 * Automatically handles Cloudinary assets and falls back to local disk unlinking for legacy files.
 * @param {string} publicIdOrUrl
 * @returns {Promise<{deleted: boolean, type: string}>}
 */
const deleteImage = async (publicIdOrUrl) => {
  if (!publicIdOrUrl || typeof publicIdOrUrl !== "string") {
    return { deleted: false, type: "invalid" };
  }

  // Case 1: Cloudinary URL
  if (isCloudinaryUrl(publicIdOrUrl)) {
    const publicId = getPublicIdFromUrl(publicIdOrUrl);
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId);
        return { deleted: true, type: "cloudinary" };
      } catch (err) {
        console.error("Cloudinary delete error:", err.message);
        return { deleted: false, type: "cloudinary", error: err.message };
      }
    }
  }

  // Case 2: Cloudinary public_id (e.g. "automall/products/...")
  if (publicIdOrUrl.startsWith("automall/")) {
    try {
      await cloudinary.uploader.destroy(publicIdOrUrl);
      return { deleted: true, type: "cloudinary" };
    } catch (err) {
      console.error("Cloudinary delete error:", err.message);
      return { deleted: false, type: "cloudinary", error: err.message };
    }
  }

  // Case 3: Legacy local filesystem path (e.g. "uploads/...", "/uploads/...")
  try {
    const cleanPath = publicIdOrUrl.replace(/^\/+/, "");
    const localFilePath = path.join(__dirname, "../", cleanPath);
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
      return { deleted: true, type: "local" };
    }
  } catch (err) {
    console.error("Local file delete error:", err.message);
  }

  return { deleted: false, type: "unknown" };
};

/**
 * Safely delete multiple images
 * @param {Array<string>} items - Array of public_ids or URLs
 * @returns {Promise<Array<object>>}
 */
const deleteMultiple = async (items) => {
  if (!items || !Array.isArray(items) || items.length === 0) {
    return [];
  }
  const deletePromises = items.map((item) => deleteImage(item));
  return await Promise.allSettled(deletePromises);
};

module.exports = {
  uploadBuffer,
  uploadSingle,
  uploadMultiple,
  deleteImage,
  deleteMultiple,
  isCloudinaryUrl,
  getPublicIdFromUrl,
};
