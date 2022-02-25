const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Joi = require('joi');
const {campgroundSchema} = require('./schemas')
const path = require('path');
const catchAsync = require('./utility/catchAsync');
const ExpressError = require('./utility/ExpressError');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
mongoose.connect('mongodb://localhost:27017/yelp-camp', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(
    () => {
        console.log('Mongo connected!');
    }
    ). catch(err => {
    console.log(err);
    }); 

const app = express();

const port = 3000;

app.engine('ejs', ejsMate)

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home');
})

const validateCampground = (req,res,next) =>{    
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(', ')
        throw new ExpressError(msg, 400)
    } else{
        next();
    }
}

app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
}))

app.get('/campgrounds/new', catchAsync(async (req, res) => {
    res.render('campgrounds/new')
}))

app.post('/campgrounds', validateCampground, catchAsync(async (req, res) => {
    //if(!req.body.campground){ throw new ExpressError('Invalid Campground Data', 400)};
        const newCamp = new Campground(req.body.campground);
        await newCamp.save();
        res.redirect(`campgrounds/${newCamp._id}`);
}))

app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    const foundCamp = await Campground.findById(id);
    res.render('campgrounds/show', {foundCamp}); 
}))

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const {id} = req.params;
    const foundCamp = await Campground.findById(id);
    res.render('campgrounds/edit', { foundCamp });
}))

app.put('/campgrounds/:id/', catchAsync(async (req, res) => {
    const {id} = req.params;
    const foundCamp = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new: true});
    res.redirect(`campgrounds/${foundCamp._id}`)
}))

app.delete('/campgrounds/:id/', catchAsync(async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

app.all('*', (req,res,next) =>{
    next(new ExpressError('Page not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500} = err;
    if(!err.message) err.message = 'Something went Wrong!'
    res.status(statusCode).render('error', {err});
})

app.listen(port, () =>{
    console.log('Server Running')
})

