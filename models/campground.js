const mongoose = require("mongoose");
const Review = require("./review");
const User = require("./user");
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    image: String,
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
