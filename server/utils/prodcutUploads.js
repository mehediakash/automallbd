const upload = require("./multerConfig");

// Supports up to 10 photos using memory storage
const prodcutUploads = upload.any();

module.exports = prodcutUploads;
