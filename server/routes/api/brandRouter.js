const express = require("express");
const { createBrand, getAllBrands, getBrandById, deleteBrand, editBrand } = require("../../Controller/BrandContoller");
const _ = express.Router()

_.post("/create", createBrand);
_.get("/all", getAllBrands);

_.get("/getby/:id", getBrandById);

_.put("/edit/:id", editBrand);
_.delete("/delete/:id", deleteBrand);

module.exports = _