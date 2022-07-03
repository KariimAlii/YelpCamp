//==============================DEFINITION===============================//
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//============================IMPORT MODULES============================//
const Campground = require("./models/campground"); //mongoose model
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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
//==============================HTTP REQUESTS=============================//
//============R : HOME PAGE============//
app.get("/", (req, res) => {
    res.render("home");
});
//============R : Campgrounds List============//
app.get("/campgrounds", async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
});
//============R : A New Campground FORM============//
app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
});

//============R : A Campground Details============//
app.get("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    // you could use findById(req.params.id) without destructuring
    res.render("campgrounds/show", { campground });
});
//============R : Edit Campground FORM============//
app.get("/campgrounds/:id/edit", async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/edit", { campground });
});
//============C : A New Campground============//
app.post("/campgrounds", async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
});
//============U : Update a Campground============//
app.put("/campgrounds/:id", async (req, res) => {
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
});
//============D : Delete a Campground============//
app.delete("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
});
//==============================SERVER===============================//
app.listen(3000, () => {
    console.log("App serving on Port 3000!");
});
