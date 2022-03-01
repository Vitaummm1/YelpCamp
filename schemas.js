const Joi = require('joi'); // TO VALIDATE BY JOI, AVOIDING POST REQUEST OFFSIDE CLIENT WINDOW

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().min(3).max(30),
        location: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().required(),
        description: Joi.string().required()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required().min(1),
        rating: Joi.number().required().min(1).max(5)
    }).required()
});

module.exports.userSchema = Joi.object({
    user: Joi.object({
        username: Joi.string().required().min(1),
        password: Joi.string().required().min(8),
        email: Joi.string().email({ tlds: { allow: false } })
    }).required()
});