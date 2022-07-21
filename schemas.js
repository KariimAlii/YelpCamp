//================Definitions====================//
const baseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");
//================Extensions====================//
const extension = (joi) => {
    return {
        type: "string",
        base: joi.string(),
        messages: {
            "string.escapeHTML":
                "{{#label}} must not contain any html or scripts {{#value}}",
        },
        rules: {
            escapeHTML: {
                validate(value, helpers) {
                    const clean = sanitizeHtml(value, {
                        allowedTags: [],
                        allowedAttributes: {},
                    });
                    if(value !== clean) {
                        return helpers.error("string.escapeHTML",{value});
                    }
                    return clean;
                },
            },
        },
    };
};

const Joi = baseJoi.extend(extension);

//==================Schemas====================//
module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().escapeHTML().required(),
        price: Joi.number().min(0).required(),
        //images: Joi.string().required(),
        description: Joi.string().escapeHTML().required(),
        location: Joi.string().escapeHTML().required(),
    }).required(),
    deleteImages: Joi.array(),
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().escapeHTML().required(),
        rating: Joi.number().required().min(1).max(5),
    }).required(),
});
