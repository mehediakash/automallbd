const upload = require("./multerConfig");

// Accepts a single file with field name 'photo' in memory
const Brandupload = upload.single("photo");

module.exports = Brandupload;
