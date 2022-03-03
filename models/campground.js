const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    images: [
        {
            url: String,
            filename: String
        }
    ],
    geometry: { // FORMAT COMES FROM THE DOCS
        type: {
            type: String,
            enum: ['Point'], // ONLY CAN BE POINT
            required: true
    },
        coordinates: {
            type: [Number],
            required: true
        }},
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

CampgroundSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })

    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);