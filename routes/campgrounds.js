//==============================DEFINITION===============================//
const express = require("express");
const app = express();
const path = require("path");
const router = express.Router();
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
const {
    isLoggedIn,
    isCampAuthor,
    validateCampground,
} = require("../middleware");
//=========================Import Controllers=========================//
const campgrounds = require("../controllers/campgrounds");

//========= [/campgrounds/....] ==========//
router
    .route("/")
    .get(campgrounds.index) //==R : INDEX==//
    .post(isLoggedIn, validateCampground, campgrounds.createCamp); //==C : A New Campground==//

//============R : A New Campground FORM============//
router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router
    .route("/:id")
    .get( campgrounds.showCamp)//==R : A Campground Details==//
    .put(isLoggedIn,isCampAuthor,validateCampground,campgrounds.updateCamp)//===U : Update a Campground====//
    .delete(isCampAuthor, campgrounds.deleteCamp);//==D : Delete a Campground==//

    //============R : Edit Campground FORM============//
router.get("/:id/edit", isLoggedIn, isCampAuthor, campgrounds.renderEditForm);

/*******************************************************************/
module.exports = router;
/*******************************************************************/
