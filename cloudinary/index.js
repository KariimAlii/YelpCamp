const express = require("express");
const app = express();
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
    secure: true,
});
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "YelpCamp",
        allowed_formats:['png','jpg','jpeg'],
        tags:['nature','campground']
    },
});


/*
app.post('/upload', parser.single('image'), function (req, res) {
  res.json(req.file);
});
 */
module.exports = {
    cloudinary,
    storage,
};
