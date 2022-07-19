//========================Importing Modules=======================//
const Campground = require("../models/campground");
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const { cloudinary } = require("../cloudinary");
//========================Mapbox=======================//
//=====first:creating service client=====//
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({
    accessToken:mapboxToken,
});
/*
const responce = await geocodingClient.forwardGeocode({
    query: "",
});
we need => responce.body
*/
/*************************************************************************************/
/*************************************************************************************/
module.exports.index = catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
});
module.exports.renderNewForm = (req, res) => {
    res.render("campgrounds/new");
};
module.exports.createCamp = catchAsync(async (req, res, next) => {
    const geoData = await geocodingClient
        .forwardGeocode({
            query: req.body.campground.location,
            limit: 1,
        })
        .send();

    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map((image) => {
        return { url: image.path, filename: image.filename };
    });
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash("success", "You created a new campground");
    res.redirect(`/campgrounds/${campground._id}`);
});
module.exports.showCamp = catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("author");
    if (!campground) {
        req.flash("error", "Cannot find that campground!");
        return res.redirect("/campgrounds");
    }

    //console.log(res.locals.currentUser)
    //console.log(campground.author)
    // Note: either you can compare (res.locals.currentUser) with (campground.author) or you can compare their ObjectId
    res.render("campgrounds/show", { campground });
});
module.exports.renderEditForm = catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash("error", "Cannot find that campground!");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
});
module.exports.updateCamp = catchAsync(async (req, res) => {
    const { id } = req.params;
        //console.log(req.body,req.files);
    //===============Editing Location================//
    const geoData = await geocodingClient
    .forwardGeocode({
        query: req.body.campground.location,
        limit: 1,
    })
    .send();
    //===============Updating campground Info using (req.body.campground)object================//
    const campground = await Campground.findByIdAndUpdate(
        id,
        req.body.campground, // {...req.body.campground}
        {
            runValidators: true,
            new: true,
        }
    );
    //===============Editing Location================//
    campground.geometry = geoData.body.features[0].geometry;
    //===============Adding new Images using (req.files)array================//
    const newImages = req.files.map((image) => {
        return { url: image.path, filename: image.filename };
    });
    campground.images.unshift(...newImages);
    await campground.save();
    //===============Deleting Some Images using (req.body.deleteImages)array================//
    if (req.body.deleteImages) {
        //===delete from cloudinary====//
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        //===delete from mongo database====//
        await campground.updateOne({
            $pull: { images: { filename: { $in: req.body.deleteImages } } },
        });
    }
    req.flash("success", "Successfully updated campground!");
    res.redirect(`/campgrounds/${campground._id}`);
});
module.exports.deleteCamp = catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    for (let image of campground.images) {
        await cloudinary.uploader.destroy(image.filename);
    }
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully removed the campground!");
    res.redirect("/campgrounds");
});
