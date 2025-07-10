const express = require("express");
const { searchProducts } = require("../../Controller/searchController");


const _ = express.Router();

// Search products route
_.get("/search", searchProducts);

module.exports = _;
