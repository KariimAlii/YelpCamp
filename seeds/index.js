//==============================DEFINITION===============================//
const mongoose = require("mongoose");
const axios = require("axios").default;
//============================IMPORT MODULES============================//
const Campground = require("../models/campground"); //mongoose model
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");
//==============================MONGOOSE===============================//
const dbUrl = process.env.DB_URL;
mongoose
    .connect(dbUrl)
    .then(() => {
        console.log("DATABASE CONNECTED!");
    })
    .catch((err) => {
        console.log("MONGO ERROR OCCURED");
        console.log(err);
    });

const gallery = [
    // 15 objects
    {
        url: "https://res.cloudinary.com/karim-ali/image/upload/v1658156172/YelpCamp/tommy-lisbin-xr-y6Ruw7K8-unsplash_ygqpww.jpg",
        filename: "YelpCamp/tommy-lisbin-xr-y6Ruw7K8-unsplash_ygqpww",
    },
    {
        url: "https://res.cloudinary.com/karim-ali/image/upload/v1658156127/YelpCamp/luke-ellis-craven-HKElxYGTXsE-unsplash_e07fyh.jpg",
        filename: "YelpCamp/luke-ellis-craven-HKElxYGTXsE-unsplash_e07fyh",
    },
    {
        url: "https://res.cloudinary.com/karim-ali/image/upload/v1658156108/YelpCamp/casey-horner-4rDCa5hBlCs-unsplash_yjf0ge.jpg",
        filename: "YelpCamp/casey-horner-4rDCa5hBlCs-unsplash_yjf0ge",
    },
    {
        url: "https://res.cloudinary.com/karim-ali/image/upload/v1658156102/YelpCamp/tim-swaan-eOpewngf68w-unsplash_adkxhi.jpg",
        filename: "YelpCamp/tim-swaan-eOpewngf68w-unsplash_adkxhi",
    },
    {
        url: "https://res.cloudinary.com/karim-ali/image/upload/v1658156053/YelpCamp/gantas-vaiciulenas-QchymJS9iJ0-unsplash_t0z0ma.jpg",
        filename: "YelpCamp/gantas-vaiciulenas-QchymJS9iJ0-unsplash_t0z0ma",
    },
    {
        url: "https://res.cloudinary.com/karim-ali/image/upload/v1658156023/YelpCamp/kevin-schmid--grs8iMGqQE-unsplash_ulyade.jpg",
        filename: "YelpCamp/kevin-schmid--grs8iMGqQE-unsplash_ulyade",
    },
    {
        url: "https://res.cloudinary.com/karim-ali/image/upload/v1658156023/YelpCamp/vincent-guth-UhGZ-k6EB_g-unsplash_updqkb.jpg",
        filename: "YelpCamp/vincent-guth-UhGZ-k6EB_g-unsplash_updqkb",
    },
    {
        url: "https://res.cloudinary.com/karim-ali/image/upload/v1658156021/YelpCamp/warren-wong-QqoqjtYYpkc-unsplash_fsmjoa.jpg",
        filename: "YelpCamp/warren-wong-QqoqjtYYpkc-unsplash_fsmjoa",
    },
    {
        url: "https://res.cloudinary.com/karim-ali/image/upload/v1658156018/YelpCamp/skyler-smith-PrWCJQcqGI0-unsplash_jnchph.jpg",
        filename: "YelpCamp/skyler-smith-PrWCJQcqGI0-unsplash_jnchph",
    },
    {
        url: "https://res.cloudinary.com/karim-ali/image/upload/v1658156001/YelpCamp/jeff-finley-m2NqjpyjaSo-unsplash_lta2t9.jpg",
        filename: "YelpCamp/jeff-finley-m2NqjpyjaSo-unsplash_lta2t9",
    },
    {
        url: "https://res.cloudinary.com/karim-ali/image/upload/v1658155996/YelpCamp/kevin-erdvig-BdfHZ4LH11A-unsplash_m0cn6u.jpg",
        filename: "YelpCamp/kevin-erdvig-BdfHZ4LH11A-unsplash_m0cn6u",
    },
    {
        url: "https://res.cloudinary.com/karim-ali/image/upload/v1658155992/YelpCamp/redd-VnT16lAOFiE-unsplash_gaosow.jpg",
        filename: "YelpCamp/redd-VnT16lAOFiE-unsplash_gaosow",
    },
    {
        url: "https://res.cloudinary.com/karim-ali/image/upload/v1658155991/YelpCamp/chris-schog-EnCaUE4QNOw-unsplash_gnrnl0.jpg",
        filename: "YelpCamp/chris-schog-EnCaUE4QNOw-unsplash_gnrnl0",
    },
    {
        url: "https://res.cloudinary.com/karim-ali/image/upload/v1658155990/YelpCamp/siim-lukka-f6OOjJNcuzA-unsplash_c0jza9.jpg",
        filename: "YelpCamp/siim-lukka-f6OOjJNcuzA-unsplash_c0jza9",
    },
    {
        url: "https://res.cloudinary.com/karim-ali/image/upload/v1658155979/YelpCamp/joshua-earle-tUb9a0RB04k-unsplash_goez5q.jpg",
        filename: "YelpCamp/joshua-earle-tUb9a0RB04k-unsplash_goez5q",
    },
];

// to pick a random item with index from ( 0 ~ array.length )
const sample = (array) => array[Math.floor(Math.random() * array.length) + 0];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        try {
            const random1000 = Math.floor(Math.random() * 1000) + 0; // 0 ~ 1000
            // cities array contains 1000 objects => cities.length = 1000
            const galleryIndex = Math.floor(Math.random() * 13) + 1; // 1 ~ 13
            const price = Math.floor(Math.random() * 20) + 10; // 10 ~ 20 $
            const camp = new Campground({
                author: "62da7473b3d26dfc70c0bc50", 
                location: `${cities[random1000].city} , ${cities[random1000].state}`,
                title: `${sample(descriptors)} ${sample(places)}`,
                images: [
                    gallery[galleryIndex],
                    gallery[galleryIndex + 1],
                    gallery[galleryIndex - 1],
                ],
                description:
                    "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Placeat necessitatibus, aliquam inventore excepturi cumque quam. Ipsum in eum repellat eligendi consequuntur molestiae, aperiam ea molestias cumque animi nesciunt, ducimus harum",
                price, //price:price ==> price (shorthand)
                geometry: {
                    type: "Point",
                    coordinates: [
                        cities[random1000].longitude,
                        cities[random1000].latitude,
                    ],
                },
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
