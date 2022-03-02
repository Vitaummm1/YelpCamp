const express = require('express');
const router = express.Router({ mergeParams: true });
const users = require('../controllers/users');
const catchAsync = require('../utility/catchAsync');
const ExpressError = require('../utility/ExpressError');
const User = require('../models/user');
const passport = require('passport');
const {userSchema} = require('../schemas');

const validateUser = (req,res,next) =>{ // TO AVOID REGISTERING OUTSIDE CLIENT WINDOW
    const {error} = userSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    } else{
        next();
    }
}

router.route('/register')
    .get(users.register)
    .post(validateUser, catchAsync(users.newUser));

router.route('/login')
    .get(users.loginForm)
    .post(passport.authenticate('local', {failureFlash:true, failureRedirect: '/login'}), // TO AUTHENTICANTE IN LOCAL DB; INSTEAD OF LOCAL, CAN USE GOOGLE, FB OR SIMILAR
    users.loginMsg);

router.get('/logout', users.logout);

module.exports = router;