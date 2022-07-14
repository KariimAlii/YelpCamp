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
const {
    isLoggedIn,
    isAuthor,
    isReviewAuthor,
    validateReview,
} = require("../middleware");
//============================IMPORT CONTROLLERS============================//
const reviews = require("../controllers/reviews");
//============================Routes============================//
const campgroundsRouter = require("./campgrounds");
app.use("/campgrounds", campgroundsRouter);
//========= [/campgrounds/:id/reviews....] ==========//

//============C : A New Review============//
router.post("/", isLoggedIn, validateReview, reviews.createReview);
//============D : Delete a Review============//
router.delete("/:reviewID", isLoggedIn, isReviewAuthor, reviews.deleteReview);

/*******************************************************************/
module.exports = router;
/*******************************************************************/
