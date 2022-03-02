const Campground = require('../models/campground');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
};

module.exports.renderForm = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.renderEdit = async (req, res) => {
    const {id} = req.params;
    if(!foundCamp){
        req.flash('error', 'Cannot find this page');
        return res.redirect('/campgrounds')
    }
    const foundCamp = await Campground.findById(id);
    res.render('campgrounds/edit', { foundCamp });
}

module.exports.newCampground = async (req, res) => {
    //if(!req.body.campground){ throw new ExpressError('Invalid Campground Data', 400)};
        const newCamp = new Campground(req.body.campground);
        newCamp.author = req.user._id;
        await newCamp.save();
        req.flash('success', 'Successfully made a new campground');
        res.redirect(`campgrounds/${newCamp._id}`);
}

module.exports.findCampground = async (req, res) => {
    const {id} = req.params;
    const foundCamp = await (await Campground.findById(id).populate({path:'reviews', populate: {path: 'author'}}).populate('author'));
    if(!foundCamp){
        req.flash('error', 'Cannot find this page');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', {foundCamp, msg: req.flash('success')}); 
}

module.exports.editCampground = async (req, res) => {
    const {id} = req.params;
    const foundCamp = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new: true});
    req.flash('success', 'Successfully updated campground');
    res.redirect(`/campgrounds/${foundCamp._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}