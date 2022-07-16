//=========================Environment Variables=========================//
if (process.env.NODE_ENV !== "production") {
    // => we want to require (dotenv) only in development mode
    require("dotenv").config();
}
// Note: By Default => process.env.NODE_ENV === 'development'
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

//============================IMPORT MODULES============================//
//==========IMPORT MODELS==========//
const Campground = require("./models/campground");
const Review = require("./models/review");
const User = require("./models/user");
//==========IMPORT UTILS==========//
const ExpressError = require("./utils/ExpressError");
const catchAsync = require("./utils/catchAsync");
//==========IMPORT Joi Schemas==========//
const { campgroundSchema, reviewSchema } = require("./schemas.js");
//==========IMPORT Middleware==========//
const { isLoggedIn } = require("./middleware");
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

//app.use(passport.authenticate('session'));

//his can also be accomplished, more succinctly, using the passport.session() alias
app.use(session(sessionConfig));
//==============================Flash===============================//
const flash = require("connect-flash");
app.use(flash());

//===========================Authentication============================//
//==============================Passport===============================//
const passport = require("passport");
const LocalStrategy = require("passport-local");
// First Step : Configure the passport-local strategy
// Second Step :  Register by calling .use()
// Third Step : Authenticate
// use static authenticate method of model in LocalStrategy
//passport-local-mongoose adds a helper method createStrategy as static method to your schema. The createStrategy is responsible to setup passport-local LocalStrategy with the correct options.
passport.use(User.createStrategy());
//====login session=======//
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//==============================Res.Locals===============================//
app.use((req, res, next) => {
    //console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});
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
const usersRouter = require("./routes/users");
app.use("/campgrounds", campgroundsRouter);
app.use("/campgrounds/:id/reviews", reviewsRouter);
app.use("/", usersRouter);
//==============================HTTP REQUESTS=============================//
//============R : HOME PAGE============//

app.get("/", (req, res) => {
    res.render("home");
});
//============R : Fake User Register Form============//
app.get("/fakeUser", async (req, res) => {
    const user = new User({
        email: "coltttt@gmail.com",
        username: "Colt Steele",
    });
    const newUser = await User.register(user, "K123");
    res.send(newUser);
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
