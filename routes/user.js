const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utility/catchAsync');
const ExpressError = require('../utility/ExpressError');
const User = require('../models/user');
const passport = require('passport');
const {userSchema} = require('../schemas')

const validateUser = (req,res,next) =>{ // TO AVOID REGISTERING OUTSIDE CLIENT WINDOW
    const {error} = userSchema.validate(req.body);
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

router.post('/register', validateUser, catchAsync(async (req, res, next) => {
    try{
        const user = new User({ email: req.body.user.email, username: req.body.user.username });
        const registeredUser = await User.register(user, req.body.user.password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        });
    } catch(e){
        req.flash('error', e.message);
        res.redirect('/register')
    }
    
}));

router.get('/login', (req, res) => {
    res.render('users/login')
});

router.post('/login', passport.authenticate('local', {failureFlash:true, failureRedirect: '/login'}), // TO AUTHENTICANTE IN LOCAL DB; INSTEAD OF LOCAL, CAN USE GOOGLE, FB OR SIMILAR
async (req, res) => { 
    req.flash('success', 'Welcome back!');
    res.redirect('/campgrounds');    
});

router.get('/logout', (req,res) =>{
    req.logout();
    req.flash('success', 'Log Out')
    res.redirect('/');
})
module.exports = router;