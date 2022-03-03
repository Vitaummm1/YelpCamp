const Campground = require('../models/campground');
const {cloudinary} = require('../cloudinary')

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
};

module.exports.renderForm = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.renderEdit = async (req, res) => {
    const {id} = req.params;
    const foundCamp = await Campground.findById(id);
    if(!foundCamp){
        req.flash('error', 'Cannot find this page');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { foundCamp });
}

module.exports.newCampground = async (req, res) => {
    //if(!req.body.campground){ throw new ExpressError('Invalid Campground Data', 400)};
        const newCamp = new Campground(req.body.campground);
        newCamp.images = req.files.map(f => ({url: f.path, filename: f.filename}));
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
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    foundCamp.images.push(...imgs);
    await foundCamp.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
        await foundCamp.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
    }
    req.flash('success', 'Successfully updated campground');
    res.redirect(`/campgrounds/${foundCamp._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const {id} = req.params;
    const foundCamp = await Campground.findById(id);
    for(let img of foundCamp.images){
        await cloudinary.uploader.destroy(img.filename)
    }
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}   