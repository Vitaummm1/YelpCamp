// ALL REQUIRED LIB
const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Joi = require('joi');
const path = require('path');
const ExpressError = require('./utility/ExpressError');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash')

// TO REQUIRE ROUTES
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews')

// TO CONNECT TO MONGODB
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

app.set('views', path.join(__dirname, '/views')); //PATH.JOIN REQUIRED TO SET THE CORRECT PATH, EVEN IF CHANGES IT DIRECTORY
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true})); // TO USE NESTED OBJECTS (JSON)
app.use(methodOverride('_method')); // TO USE PATCH, PUT OR DELETE REQUESTS IN FORMS
app.use(express.static(path.join((__dirname), '/public'))); //PATH.JOIN REQUIRED TO SET THE CORRECT PATH, EVEN IF CHANGES IT DIRECTORY

const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookies: {
        httpOnly: true,
        expires: Date.now() + (1000 * 60 * 60 * 24 * 7),// DATE ON MILISECONDS
        maxAge: (1000 * 60 * 60 * 24 * 7) 
    }
}
app.use(session(sessionConfig));

app.use(flash()) // TO USE FLASH

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    next();
})

// TO USE ROUTES
app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)

// OLD VERSION - BEFORE ROUTES > GO TO ROUTES/CAMPGROUNDS
// const validateCampground = (req,res,next) =>{    
//     const {error} = campgroundSchema.validate(req.body);
//     if(error){
//         const msg = error.details.map(el => el.message).join(', ');
//         throw new ExpressError(msg, 400);
//     } else{
//         next();
//     }
// }

// OLD VERSION - BEFORE ROUTES > GO TO ROUTES/REVIEWS
// const validateReview = (req,res,next) => {
//     const {error} = reviewSchema.validate(req.body);
//     if(error){
//         const msg = error.details.map(el => el.message).join(', ')
//         throw new ExpressError(msg, 400)
//     } else{
//         next();
//     }
// }

// OLD VERSION - BEFORE ROUTES
// app.get('/campgrounds', catchAsync(async (req, res) => {
//     const campgrounds = await Campground.find({});
//     res.render('campgrounds/index', {campgrounds})
// }))

// app.get('/campgrounds/new', catchAsync(async (req, res) => {
//     res.render('campgrounds/new')
// }))

// app.post('/campgrounds', validateCampground, catchAsync(async (req, res) => {
//     //if(!req.body.campground){ throw new ExpressError('Invalid Campground Data', 400)};
//         const newCamp = new Campground(req.body.campground);
//         await newCamp.save();
//         res.redirect(`campgrounds/${newCamp._id}`);
// }))

// app.get('/campgrounds/:id', catchAsync(async (req, res) => {
//     const {id} = req.params;
//     const foundCamp = await Campground.findById(id).populate('reviews');
//     res.render('campgrounds/show', {foundCamp}); 
// }))

// app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
//     const {id} = req.params;
//     const foundCamp = await Campground.findById(id);
//     res.render('campgrounds/edit', { foundCamp });
// }))

// app.put('/campgrounds/:id/', catchAsync(async (req, res) => {
//     const {id} = req.params;
//     const foundCamp = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new: true});
//     res.redirect(`campgrounds/${foundCamp._id}`)
// }))

// app.delete('/campgrounds/:id/', catchAsync(async (req, res) => {
//     const {id} = req.params;
//     await Campground.findByIdAndDelete(id);
//     res.redirect('/campgrounds');
// }))

// OLD VERSION - BEFORE ROUTES
// app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req,res) => {
//     const {id} = req.params;
//     const campground = await Campground.findById(id);
//     const review = new Review(req.body.review);
//     campground.reviews.push(review);
//     await review.save();
//     await campground.save();
//     res.redirect(`/campgrounds/${campground._id}`);
// }))

// app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req,res) =>{
//     const {id, reviewId} = req.params;
//     await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
//     await Review.findByIdAndDelete(reviewId);
//     res.redirect(`/campgrounds/${id}`);
// }))

app.get('/', (req, res) => {
    res.render('home');
})

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

