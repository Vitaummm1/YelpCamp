const express = require('express');
const mongoose = require('mongoose')
const path = require('path')
const Campground = require('./models/campground')
mongoose.connect('mongodb://localhost:27017/yelp-camp', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(
    () => {
        console.log('Mongo connected!')
    }
    ). catch(err => {
    console.log(err)
    }); 

const app = express();

const port = 3000;

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/makeCampground', async (req, res) => {
    const camp = new Campground({
        title: 'Backyard',
        price: 'Free',
        description: 'Home style camping'
    })
    await camp.save();
})

app.get('*', (req, res) => {
    res.send('Nowhere!');
})

app.listen(port, () =>{
    console.log('Server Running')
})