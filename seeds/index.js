const mongoose = require('mongoose');
const cities = require('./cities')
const { places,descriptors } = require('./seedHelper')
const Campground =  require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(
    () => {
        console.log('Mongo connected!');
    }
    ). catch(err => {
    console.log(err);
    }); 

const sample = array => array[Math.floor(Math.random()*array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i=0; i<50; i++){
           const random = Math.floor(Math.random()*1000)
        const camp = new Campground({
            location: `${cities[random].city}, ${cities[random].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await camp.save();  
    }
}

    seedDB();