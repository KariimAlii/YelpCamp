const mongoose = require("mongoose");
const Review = require("./review");
const User = require("./user");
const Schema = mongoose.Schema;

//Resize the image to a width of 100 pixels while maintaining aspect ratio (c_scale,w_100):
//https://res.cloudinary.com/karim-ali/image/upload/v1657933403/YelpCamp/ztvjeyfiykjnjnlzphh7.jpg
//https://res.cloudinary.com/<cloud_name>/<asset_type>/<delivery_type>/<transformations>/<version>/<public_id_full_path>.<extension>
const imageSchema = new Schema({
    url: String, // req.file.path(cloudinary)
    filename: String, //req.file.filename(cloudinary)
});
imageSchema.virtual("thumbnail").get(function () {
    return this.url.replace("upload/", "upload/c_scale,w_300/");
});
imageSchema.virtual("adjustHeight").get(function () {
    return this.url.replace("upload/", "upload/c_scale,h_600/");
});
const CampgroundSchema = new Schema({
    title: String,
    images: [imageSchema], //array of objects
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
});
CampgroundSchema.post("findOneAndDelete", async function (camp) {
    if (camp) {
        /* const res =  */
        await Review.deleteMany({
            _id: {
                $in: camp.reviews,
            },
        });
    }
});
// camp => is the deleted document
// res => is the count of deleted reviews
//*****************************EXPORT MODULE******************************//
module.exports = mongoose.model("Campground", CampgroundSchema);
//*****************************EXPORT MODULE******************************//
