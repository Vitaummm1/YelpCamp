const express = require('express');
const router = express.Router({ mergeParams: true }); // NEED MERGE PARAMS BC CANT REACH, ON LINE 23, THE ID (REQ.PARAMS) ON APP.JS (MAKING IT NULL). SO, DO THIS TO GET THIS VALUE
const catchAsync = require('../utility/catchAsync');
const ExpressError = require('../utility/ExpressError');
const Campground = require('../models/campground');
const Review = require('../models/review');
const {reviewSchema} = require('../schemas')
const isLoggedIn = require('../utility/isLoggedInMiddleware');

const validateReview = (req,res,next) => { // TO AVOID REGISTERING OUTSIDE CLIENT WINDOW
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(', ')
        throw new ExpressError(msg, 400)
    } else{
        next();
    }
}

const isAuthorReview = async (req,res,next) =>{
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId)
    if (!review.author.equals(req.user._id)){
        req.flash('error', 'You dont have access to that');
        res.redirect(`/campgrounds/${id}`)
    }
    next();
}

router.post('/', isLoggedIn, validateReview, catchAsync(async (req,res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    review.author = req.user._id
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:reviewId', isLoggedIn, isAuthorReview, catchAsync(async (req,res) =>{
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;