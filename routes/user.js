const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utility/catchAsync');
const ExpressError = require('../utility/ExpressError');
const User = require('../models/user');
const passport = require('passport');

const validateUser = (req,res,next) =>{ // TO AVOID REGISTERING OUTSIDE CLIENT WINDOW
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    } else{
        next();
    }
}

router.get('/register', async (req, res) => {
    res.render('users/register')
});

router.post('/register', validateUser, catchAsync(async (req, res) => {
    try{
        const {email, username, password} = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.flash('success', 'Welcome to Yelp Camp!');
        res.redirect('/campgrounds');
    } catch(e){
        req.flash('error', e.message);
        res.redirect('/register')
    }
    
}));

router.get('/login', async (req, res) => {
    res.render('users/login')
});

router.post('/login', passport.authenticate('local', {failureFlash:true, failureRedirect: '/login'}), // TO AUTHENTICANTE IN LOCAL DB; INSTEAD OF LOCAL, CAN USE GOOGLE, FB OR SIMILAR
async (req, res) => { 
    req.flash('success', 'Welcome back!');
    res.redirect('/campgrounds');    
});

module.exports = router;