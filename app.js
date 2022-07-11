//==============================DEFINITION===============================//
const express = require("express");
const app = express();
const path = require("path");
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
//==============================SESSION===============================//
const session = require("express-session");
const sessionConfig = {
    secret: "KimoComposer",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //1week in ms
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};
app.use(session(sessionConfig));

//==============================Flash===============================//
const flash = require("connect-flash");
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});
//============================IMPORT MODULES============================//
//==========IMPORT MODELS==========//
const Campground = require("./models/campground");
const Review = require("./models/review");
//==========IMPORT UTILS==========//
const ExpressError = require("./utils/ExpressError");
const catchAsync = require("./utils/catchAsync");
//==========IMPORT Joi Schemas==========//
const { campgroundSchema, reviewSchema } = require("./schemas.js");
//==============================MONGOOSE===============================//
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose
    .connect("mongodb://localhost:27017/yelpCamp")
    .then(() => {
        console.log("DATABASE CONNECTED!");
    })
    .catch((err) => {
        console.log("MONGO ERROR OCCURED");
        console.log(err);
    });

//============================Routes============================//
const campgroundsRouter = require("./routes/campgrounds");
const reviewsRouter = require("./routes/reviews");

app.use("/campgrounds", campgroundsRouter);
app.use("/campgrounds/:id/reviews", reviewsRouter);

//==============================HTTP REQUESTS=============================//
//============R : HOME PAGE============//

app.get("/", (req, res) => {
    res.render("home");
});

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
