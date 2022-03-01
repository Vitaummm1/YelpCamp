const express = require('express');
const router = express.Router();
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

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new')
});

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    //if(!req.body.campground){ throw new ExpressError('Invalid Campground Data', 400)};
        const newCamp = new Campground(req.body.campground);
        newCamp.author = req.user._id;
        await newCamp.save();
        req.flash('success', 'Successfully made a new campground');
        res.redirect(`campgrounds/${newCamp._id}`);
}))

router.get('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const {id} = req.params;
    const foundCamp = await (await Campground.findById(id).populate({path:'reviews', populate: {path: 'author'}}).populate('author'));
    if(!foundCamp){
        req.flash('error', 'Cannot find this page');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', {foundCamp, msg: req.flash('success')}); 
}))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const {id} = req.params;
    if(!foundCamp){
        req.flash('error', 'Cannot find this page');
        return res.redirect('/campgrounds')
    }
    const foundCamp = await Campground.findById(id);
    res.render('campgrounds/edit', { foundCamp });
}))

router.patch('/:id/', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const {id} = req.params;
    const foundCamp = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new: true});
    req.flash('success', 'Successfully updated campground');
    res.redirect(`/campgrounds/${foundCamp._id}`)
}))

router.delete('/:id/', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

module.exports = router;