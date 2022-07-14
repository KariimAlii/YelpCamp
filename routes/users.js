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

const User = require("../models/user");

//===========================middleware============================//
const { checkReturnTo } = require("../middleware");
//===========================Authentication============================//
//==============================Passport===============================//
const passport = require("passport");
const LocalStrategy = require("passport-local");
passport.use(User.createStrategy());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
/***********************************************************************/
/***********************************************************************/
//==================R:Register Form =======================//
router.get("/register", (req, res) => {
    res.render("users/register");
});
//==================C:Register New User =======================//
router.post(
    "/register",
    catchAsync(async (req, res, next) => {
        try {
            const { username, email, password } = req.body;
            const user = new User({ username, email });
            const registeredUser = await User.register(user, password);
            req.login(registeredUser, (err) => {
                if (err) return next(err);
                req.flash("success", "Welcome to Yelp Camp!");
                res.redirect("/campgrounds");
            });
        } catch (e) {
            req.flash("error", e.message);
            res.redirect("register");
        }
    })
);
//==================R:Login Form =======================//
router.get("/login", (req, res) => {
    res.render("users/login");
});
//==================POST:Login Authentication =======================//
router.post(
    "/login",
    checkReturnTo,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureMessage: true,
        failureFlash: true,
        //keepSessionInfo: true, /* keeps the value of (req.session.returnTo) ==> security issues */
        // for security issues (passport.authenticate) deletes (req.session) properties automatically
    }),
    (req, res) => {
        req.flash("success", "Welcome back!");
        const redirectUrl = res.locals.returnTo || "/campgrounds";
        res.redirect(redirectUrl);
    }
);
//==================GET:Logout Authentication =======================//
router.get("/logout", (req, res, next) => {
    req.logOut((err) => {
        if (err) return next(err);
        req.flash("success", "Goodbye!");
        res.redirect("/campgrounds");
    });
});
/*****************************************************************/
module.exports = router;
/*****************************************************************/
/*
Colt Steele    K123
Karim Ali      R123
Motaz          M123
Ali            A123
Rana           K123
*/
