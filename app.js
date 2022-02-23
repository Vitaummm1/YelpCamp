const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const path = require('path');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
mongoose.connect('mongodb://localhost:27017/yelp-camp', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(
    () => {
        console.log('Mongo connected!');
    }
    ). catch(err => {
    console.log(err);
    }); 

const app = express();

const port = 3000;

app.engine('ejs', ejsMate)

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
})

app.get('/campgrounds/new', async (req, res) => {
    res.render('campgrounds/new')
})

app.post('/campgrounds', async (req, res) => {
    const newCamp = new Campground(req.body.campground);
    await newCamp.save();
    res.redirect(`campgrounds/${newCamp._id}`);
})

app.get('/campgrounds/:id', async (req, res) => {
    const {id} = req.params;
    const foundCamp = await Campground.findById(id);
    res.render('campgrounds/show', {foundCamp});
})

app.get('/campgrounds/:id/edit', async (req, res) => {
    const {id} = req.params;
    const foundCamp = await Campground.findById(id);
    res.render('campgrounds/edit', { foundCamp });
})

app.put('/campgrounds/:id/', async (req, res) => {
    const {id} = req.params;
    const foundCamp = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new: true});
    res.redirect(`campgrounds/${foundCamp._id}`)
})

app.delete('/campgrounds/:id/', async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})

app.get('*', (req, res) => {
    res.send('Nowhere!');
})

app.listen(port, () =>{
    console.log('Server Running')
})