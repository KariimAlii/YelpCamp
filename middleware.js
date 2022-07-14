//==============================Import Modules===========================//
//================Models=============//
const Campground = require("./models/campground");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
    //console.log("REQ.USER===>", req.user);
    if (!req.isAuthenticated()) {
        // store the url they are requesting!
        //console.log(req.path, req.originalUrl);
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be signed in first!!");
        return res.redirect("/login");
    }
    next();
};

module.exports.checkReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
};

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    // without populating .. campground.author === ObjectId of the user that created the campground
    if (!campground.author.equals(req.user._id)) {
        req.flash("error", "You do not have the permission to do that!");
        return res.redirect(`/campgrounds/${campground._id}`);
    }
    next();
};
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewID } = req.params;
    const review = await Review.findById(reviewID);
    // without populating .. review.author === ObjectId of the user that created the review
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You do not have the permission to do that!");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};
