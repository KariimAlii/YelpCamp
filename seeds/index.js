//==============================DEFINITION===============================//
const mongoose = require("mongoose");
const axios = require("axios").default;
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
        try {
            const config = {
                params: {
                    collections: 483251,
                    client_id: "o_X4B218EIgTs4p9tvqArmbKCFXFHreYC7Q2kNNfqVo",
                },
            };
            const result = await axios.get(
                "https://api.unsplash.com/photos/random",
                config
            );
            const random1000 = Math.floor(Math.random() * 1000) + 0; // 0 ~ 1000
            // cities array contains 1000 objects => cities.length = 1000
            const price = Math.floor(Math.random() * 20) + 10; // 10 ~ 20 $
            const camp = new Campground({
                location: `${cities[random1000].city} , ${cities[random1000].state}`,
                title: `${sample(descriptors)} ${sample(places)}`,
                image: result.data.urls.regular,
                description:
                    "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Placeat necessitatibus, aliquam inventore excepturi cumque quam. Ipsum in eum repellat eligendi consequuntur molestiae, aperiam ea molestias cumque animi nesciunt, ducimus harum",
                price, //price:price ==> price (shorthand)
            });
            await camp.save();
        } catch {
            (e) => console.log("oOoH", e);
        }
    }
};
// seedDB is async function => it returns a promise

seedDB().then(() => {
    mongoose.connection.close(); // to close connection with mongoDB after execution of function seedDB()
});

/* 
const getImg = async () => {
    const config = { params: { collections: 483251 , client_id : 'o_X4B218EIgTs4p9tvqArmbKCFXFHreYC7Q2kNNfqVo' } };
    const result = await axios.get(
        "https://api.unsplash.com/photos/random",
        config
    );
    console.log(result.data.urls.regular)
};
getImg()
*/
