module.exports = function (req,res,next){
    if(!req.isAuthenticated()){
        req.flash('error', 'Need to be Logged In');
        return res.redirect('/login');
    }
    next();
}
