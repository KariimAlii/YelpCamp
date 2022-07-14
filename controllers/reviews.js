//============================IMPORT MODULES============================//
//==========IMPORT UTILS==========//
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
//==========IMPORT MODELS==========//
const Campground = require("../models/campground");
const Review = require("../models/review");
/****************************************************************************/
/****************************************************************************/
module.exports.createReview = catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);

    await review.save();
    await campground.save();

    req.flash("success", "Created new review!");
    res.redirect(`/campgrounds/${campground._id}`);
});

module.exports.deleteReview = catchAsync(async (req, res, next) => {
    const { id, reviewID } = req.params;

    await Review.findByIdAndDelete(reviewID);
    const campground = await Campground.findByIdAndUpdate(id, {
        $pull: { reviews: reviewID },
    });

    //console.log(campground.reviews);
    //console.log(reviewID);
    req.flash("success", "Successfully deleted review!");
    res.redirect(`/campgrounds/${id}`);
});
