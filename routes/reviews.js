//==============================DEFINITION===============================//
const express = require("express");
const app = express();
const path = require("path");
const router = express.Router({ mergeParams: true });
const bodyParser = require("body-parser");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
//==============================SETTING===============================//
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
//============================IMPORT MODULES============================//
//==========IMPORT UTILS==========//
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
//==========IMPORT MODELS==========//
const Campground = require("../models/campground");
const Review = require("../models/review");
//==========IMPORT Joi Schemas==========//
const { reviewSchema } = require("../schemas.js");
//==========IMPORT Middleware==========//
const { isLoggedIn } = require("../middleware");
//=========================Validation Middleware=========================//

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        console.log(msg);
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};
//============================Routes============================//
const campgroundsRouter = require("./campgrounds");
app.use("/campgrounds", campgroundsRouter);
//========= [/campgrounds/:id/reviews....] ==========//

//============C : A New Review============//
router.post(
    "/",
    validateReview,
    catchAsync(async (req, res, next) => {
        const campground = await Campground.findById(req.params.id);
        const review = new Review(req.body.review);

        campground.reviews.push(review);

        await review.save();
        await campground.save();

        req.flash("success", "Created new review!");
        res.redirect(`/campgrounds/${campground._id}`);
    })
);
//============D : Delete a Review============//
router.delete(
    "/:reviewID",
    catchAsync(async (req, res, next) => {
        const { id, reviewID } = req.params;

        await Review.findByIdAndDelete(reviewID);
        const campground = await Campground.findByIdAndUpdate(id, {
            $pull: { reviews: reviewID },
        });

        //console.log(campground.reviews);
        //console.log(reviewID);
        req.flash('success','Successfully deleted review!')
        res.redirect(`/campgrounds/${id}`);
    })
);

/*******************************************************************/
module.exports = router;
/*******************************************************************/
