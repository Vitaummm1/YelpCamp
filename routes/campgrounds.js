const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utility/catchAsync');
const ExpressError = require('../utility/ExpressError');
const Campground = require('../models/campground');
const {campgroundSchema} = require('../schemas')
const isLoggedIn = require('../utility/isLoggedInMiddleware');

const validateCampground = (req,res,next) =>{ // TO AVOID REGISTERING OUTSIDE CLIENT WINDOW  
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    } else{
        next();
    }
}

const isAuthor = async (req,res,next) => {
    const {id} = req.params;
    const verId = await Campground.findById(id);
    if (!verId.author.equals(req.user._id)){
        req.flash('error', 'You dont have access to that');
        return res.redirect(`/campgrounds/${verId._id}`)
    }
    next();
} 

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.newCampground));

router.get('/new', isLoggedIn, campgrounds.renderForm);

router.route('/:id')
    .get(isLoggedIn, catchAsync(campgrounds.findCampground))
    .patch(isLoggedIn, isAuthor, catchAsync(campgrounds.editCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEdit))

module.exports = router;