const express = require('express');
const router = express.Router();
const catchAsync = require('../utility/catchAsync');
const ExpressError = require('../utility/ExpressError');
const Campground = require('../models/campground');
const {campgroundSchema} = require('../schemas')

const validateCampground = (req,res,next) =>{    
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    } else{
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
}))

router.get('/new', catchAsync(async (req, res) => {
    res.render('campgrounds/new')
}))

router.post('/', validateCampground, catchAsync(async (req, res) => {
    //if(!req.body.campground){ throw new ExpressError('Invalid Campground Data', 400)};
        const newCamp = new Campground(req.body.campground);
        await newCamp.save();
        req.flash('success', 'Successfully made a new campground');
        res.redirect(`campgrounds/${newCamp._id}`);
}))

router.get('/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    const foundCamp = await Campground.findById(id).populate('reviews');
    res.render('campgrounds/show', {foundCamp, msg: req.flash('success')}); 
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
    const {id} = req.params;
    const foundCamp = await Campground.findById(id);
    res.render('campgrounds/edit', { foundCamp });
}))

router.put('/:id/', catchAsync(async (req, res) => {
    const {id} = req.params;
    const foundCamp = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new: true});
    res.redirect(`campgrounds/${foundCamp._id}`)
}))

router.delete('/:id/', catchAsync(async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

module.exports = router;