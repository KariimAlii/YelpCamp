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

    const gallery = [ // 8 objects
    {
        url:'https://res.cloudinary.com/karim-ali/image/upload/v1657854450/YelpCamp/uvwg8mx21e4ypg83sh1d.jpg',
        filename:'YelpCamp/uvwg8mx21e4ypg83sh1d'

    },
    {
        url:'https://res.cloudinary.com/karim-ali/image/upload/v1657854450/YelpCamp/naakgrpehap9qykzkfug.jpg',
        filename:'YelpCamp/naakgrpehap9qykzkfug'

    },
    {
        url:'https://res.cloudinary.com/karim-ali/image/upload/v1657854449/YelpCamp/wldlryd2lwvzxoerymiy.jpg',
        filename:'YelpCamp/wldlryd2lwvzxoerymiy'

    },
    {
        url:'https://res.cloudinary.com/karim-ali/image/upload/v1657854447/YelpCamp/b0nrwkumzfsdkfnuypqr.jpg',
        filename:'YelpCamp/b0nrwkumzfsdkfnuypqr'

    }, 
    {
        url:'https://res.cloudinary.com/karim-ali/image/upload/v1657854445/YelpCamp/onpbuofzyas0uq2ywwrl.jpg',
        filename:'YelpCamp/onpbuofzyas0uq2ywwrl'

    },
    {
        url:'https://res.cloudinary.com/karim-ali/image/upload/v1657854004/YelpCamp/vclato839yylei9v24lb.jpg',
        filename:'YelpCamp/vclato839yylei9v24lb'

    },
    {
        url:'https://res.cloudinary.com/karim-ali/image/upload/v1657844510/YelpCamp/uceigxj9vp74ybwt0jgo.jpg',
        filename:'YelpCamp/uceigxj9vp74ybwt0jgo'

    },
    {
        url:'https://res.cloudinary.com/karim-ali/image/upload/v1657844508/YelpCamp/wxe2nxmzb2ecasaxqp06.jpg',
        filename:'YelpCamp/wxe2nxmzb2ecasaxqp06'

    }

]

// to pick a random item with index from ( 0 ~ array.length )
const sample = (array) => array[Math.floor(Math.random() * array.length) + 0];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        try {

            const random1000 = Math.floor(Math.random() * 1000) + 0; // 0 ~ 1000
            // cities array contains 1000 objects => cities.length = 1000
            const galleryIndex = Math.floor(Math.random() * 6) + 1; // 1 ~ 6
            const price = Math.floor(Math.random() * 20) + 10; // 10 ~ 20 $
            const camp = new Campground({
                author: "62ce295a05a9928ec1c3151e",
                location: `${cities[random1000].city} , ${cities[random1000].state}`,
                title: `${sample(descriptors)} ${sample(places)}`,
                images: [ gallery[galleryIndex], gallery[galleryIndex + 1], gallery[galleryIndex - 1] ],
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

//=================UNSPLACH API======================//
/*
https://api.unsplash.com/
Get a random photo ==> GET /photos/random

param ==>	Description
collections ==>	Public collection ID(‘s) to filter selection. If multiple, comma-separated
topics ==>	Public topic ID(‘s) to filter selection. If multiple, comma-separated
username ==>	Limit selection to a single user.
query ==>	Limit selection to photos matching a search term.
orientation ==>	Filter by photo orientation. (Valid values: landscape, portrait, squarish)
content_filter ==>	Limit results by content safety. Default: low. Valid values are low and high.
count ==>	The number of photos to return. (Default: 1; max: 30)



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
            url => result.data.urls.regular



*/




