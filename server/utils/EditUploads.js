const upload = require("./multerConfig");

// Memory storage for edit uploads (supports single or multiple files)
const editupload = upload.any();

module.exports = editupload;
