const path = require("path");
const express = require('express');
const dbconfig = require("./config/dbconfig.js");
require('dotenv').config();

const router = require("./routes");

var cors = require('cors');
const errorHandler = require('./utils/errorHandeler.js');

const app = express();

// Connect to the database
dbconfig();

// Middleware to parse incoming JSON bodies
app.use(express.json()); // Make sure this is added to parse JSON in POST/PUT requests
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// CORS middleware
app.use(cors());

// Static file serving for uploads (e.g., photos)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use(router);

// Error handler middleware (should be last)
app.use(errorHandler);

// Start the server
app.listen(8000, () => {
    console.log("Server running on port 8000");
});
