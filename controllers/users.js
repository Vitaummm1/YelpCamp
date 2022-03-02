const User = require('../models/user');

module.exports.register = async (req, res) => {
    res.render('users/register')
}

module.exports.loginForm = (req, res) => {
    res.render('users/login')
}

module.exports.newUser = async (req, res, next) => {
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
    
}

module.exports.loginMsg = async (req, res) => { 
    req.flash('success', 'Welcome back!');
    res.redirect('/campgrounds');    
}

module.exports.logout = (req,res) =>{
    req.logout();
    req.flash('success', 'Log Out')
    res.redirect('/');
}