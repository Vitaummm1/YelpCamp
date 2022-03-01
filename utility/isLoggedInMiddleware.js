module.exports = func = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.flash('error', 'Need to be Logged In');
        res.redirect('/login');
    }
    next();
}
