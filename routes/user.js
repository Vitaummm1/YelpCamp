const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utility/catchAsync');
const ExpressError = require('../utility/ExpressError');
const User = require('../models/user');

router.get('/register', async (req, res) => {
    res.render('users/register')
});

router.post('/register', catchAsync(async (req, res) => {
    res.render('users/register')
}));

module.exports = router;