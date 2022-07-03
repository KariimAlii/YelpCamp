//==============================DEFINITION===============================//
const mongoose = require("mongoose");
//============================IMPORT MODULES============================//
const Campground = require("../models/campground"); //mongoose model
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");
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


// to pick a random item with index from ( 0 ~ array.length )
const sample = (array) => array[Math.floor(Math.random() * array.length) + 0];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000) + 0; // 0 ~ 1000
        // cities array contains 1000 objects => cities.length = 1000
        const camp = new Campground({
            location: `${cities[random1000].city} , ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
        });
        await camp.save();
    }
};
// seedDB is async function => it returns a promise

seedDB().then ( () => {
    mongoose.connection.close(); // to close connection with mongoDB after execution of function seedDB()
})
