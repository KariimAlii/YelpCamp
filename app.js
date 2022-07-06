//==============================DEFINITION===============================//
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");

const { campgroundSchema } = require("./schemas.js");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//============================IMPORT MODULES============================//
const Campground = require("./models/campground"); //mongoose model

const ExpressError = require("./utils/ExpressError");
const catchAsync = require("./utils/catchAsync");
//==============================MONGOOSE===============================//
mongoose
    .connect("mongodb://localhost:27017/yelpCamp")
    .then(() => {
        console.log("DATABASE CONNECTED!");
    })
    .catch((err) => {
        console.log("MONGO ERROR OCCURED");
        console.log(err);
    });
//==============================SETTING===============================//
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
//==============================VALIDATION MIDDLEWARE===============================//
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
//==============================HTTP REQUESTS=============================//
//============R : HOME PAGE============//
app.get("/", (req, res) => {
    res.render("home");
});
//============R : INDEX============//
app.get(
    "/campgrounds",
    catchAsync(async (req, res) => {
        const campgrounds = await Campground.find({});
        res.render("campgrounds/index", { campgrounds });
    })
);
//============R : A New Campground FORM============//
app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
});

//============R : A Campground Details============//
app.get(
    "/campgrounds/:id",
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const campground = await Campground.findById(id);
        // you could use findById(req.params.id) without destructuring
        res.render("campgrounds/show", { campground });
    })
);
//============R : Edit Campground FORM============//
app.get(
    "/campgrounds/:id/edit",
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const campground = await Campground.findById(id);
        res.render("campgrounds/edit", { campground });
    })
);
//============C : A New Campground============//
app.post(
    "/campgrounds",
    validateCampground,
    catchAsync(async (req, res, next) => {
        //if (!req.body.campground) throw new ExpressError("Invalid Campground Data", 400);
        const campground = new Campground(req.body.campground);
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`);
    })
);
//============U : Update a Campground============//
app.put(
    "/campgrounds/:id",
    validateCampground,
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
        res.redirect(`/campgrounds/${campground._id}`);
    })
);
//============D : Delete a Campground============//
app.delete(
    "/campgrounds/:id",
    catchAsync(async (req, res) => {
        const { id } = req.params;
        await Campground.findByIdAndDelete(id);
        res.redirect("/campgrounds");
    })
);
//============All Unmatched Http Requests============//
app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
});
/*
app.all("*", (req, res) => {
    throw new ExpressError("Page Not Found", 404);
});
*/
//==========================ERROR HANDLER=========================//
app.use((err, req, res, next) => {
    //console.log(err.stack)
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oh No Something went wrong ...";
    res.status(statusCode).render("error", { err });
});
//==============================SERVER===============================//
app.listen(3000, () => {
    console.log("App serving on Port 3000!");
});
