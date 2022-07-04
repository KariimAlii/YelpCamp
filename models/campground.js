const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
});

//*****************************EXPORT MODULE******************************//
module.exports = mongoose.model("Campground", CampgroundSchema);
//*****************************EXPORT MODULE******************************//
