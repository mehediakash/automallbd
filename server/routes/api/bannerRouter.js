const express = require("express");
const { bannerUpload, editBanner, deleteBanner, getAllbanner, getABanner } = require("../../Controller/bannerController");

const _ = express.Router()

_.post("/upload", bannerUpload);
_.get("/all", getAllbanner);
_.get("/banner/:id", getABanner);
_.put("/edit/:id", editBanner);
_.delete("/delete/:id", deleteBanner);

module.exports = _


