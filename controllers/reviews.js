const Review = require('../models/review');
const Campground = require('../models/campground');

module.exports.newReview = async (req,res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    review.author = req.user._id
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview = async (req,res) =>{
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}