//==============================DEFINITION===============================//
const express = require("express");
const app = express();
//============================IMPORT MODULES============================//
//==========IMPORT UTILS==========//
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
//==========IMPORT MODELS==========//
const User = require("../models/user");

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
module.exports.renderRegisterForm = (req, res) => {
    res.render("users/register");
};
module.exports.registerUser = catchAsync(async (req, res, next) => {
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
});
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login");
};
module.exports.loginAuth = passport.authenticate("local", {
    failureRedirect: "/login",
    failureMessage: true,
    failureFlash: true,
    //keepSessionInfo: true, /* keeps the value of (req.session.returnTo) ==> security issues */
    // for security issues (passport.authenticate) deletes (req.session) properties automatically
});
module.exports.login = (req, res) => {
    req.flash("success", "Welcome back!");
    const redirectUrl = res.locals.returnTo || "/campgrounds";
    res.redirect(redirectUrl);
};
module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if (err) return next(err);
        req.flash("success", "Goodbye!");
        res.redirect("/");
    });
};
