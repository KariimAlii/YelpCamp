//==============================DEFINITION===============================//
const express = require("express");
const app = express();
const path = require("path");
const router = express.Router();
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
//==============================FLASH==============================//
const flash = require("connect-flash");
app.use(flash());
//============================IMPORT MODULES============================//
//==========IMPORT UTILS==========//
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
//==========IMPORT MODELS==========//
const Campground = require("../models/campground");
const Review = require("../models/review");
//==========IMPORT Joi Schemas==========//
const { campgroundSchema } = require("../schemas.js");
//==========IMPORT Middleware==========//
const { isLoggedIn } = require("../middleware");
//=========================Validation Middleware=========================//
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        console.log(msg);
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

//========= [/campgrounds/....] ==========//

//============R : INDEX============//
router.get(
    "/",
    catchAsync(async (req, res) => {
        const campgrounds = await Campground.find({});
        res.render("campgrounds/index", { campgrounds });
    })
);
//============R : A New Campground FORM============//
router.get("/new",isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

//============R : A Campground Details============//
router.get(
    "/:id",
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const campground = await Campground.findById(id).populate("reviews");
        if (!campground) {
            req.flash("error", "Cannot find that campground!");
            return res.redirect("/campgrounds");
        }
        // you could use findById(req.params.id) without destructuring
        res.render("campgrounds/show", { campground });
    })
);
//============R : Edit Campground FORM============//
router.get(
    "/:id/edit",
    isLoggedIn,
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const campground = await Campground.findById(id);
        if (!campground) {
            req.flash("error", "Cannot find that campground!");
            return res.redirect("/campgrounds");
        }
        res.render("campgrounds/edit", { campground });
    })
);
//============C : A New Campground============//
router.post(
    "/",
    isLoggedIn,
    validateCampground,
    catchAsync(async (req, res, next) => {
        //if (!req.body.campground) throw new ExpressError("Invalid Campground Data", 400);
        const campground = new Campground(req.body.campground);
        await campground.save();
        req.flash("success", "You created a new campground");
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

//============U : Update a Campground============//
router.put(
    "/:id",
    validateCampground,
    isLoggedIn,
    catchAsync(async (req, res) => {
        const { id } = req.params;

        const campground = await Campground.findByIdAndUpdate(
            id,
            req.body.campground, // {...req.body.campground}
            {
                runValidators: true,
                new: true,
            }
        );
        req.flash("success", "Successfully updated campground!");
        res.redirect(`/campgrounds/${campground._id}`);
    })
);
//============D : Delete a Campground============//
router.delete(
    "/:id",
    catchAsync(async (req, res) => {
        const { id } = req.params;
        await Campground.findByIdAndDelete(id);
        req.flash("success", "Successfully removed the campground!");
        res.redirect("/campgrounds");
    })
);

/*******************************************************************/
module.exports = router;
/*******************************************************************/
