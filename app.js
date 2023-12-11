//Make sure we can read our .env file for our keys
require('dotenv').config();

const express = require('express');
const methodOverride = require("method-override");
//Import our own module we made to connect to mongodb 
//(We use mongoose and .env file holds our connection string) 
const connectDB = require('./server/db');
const session = require('express-session');
//For session use with users

//Passport is easy for authentication so we don't need to rlly worry about it
//Documentation on https://www.passportjs.org/packages/passport-google-oauth20/
const passport = require('passport');

const MongoStore = require('connect-mongo');
const app = express();

//declare localhost port 
const port = 5000 || process.env.PORT;
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  }),
}));

//Set passport for our app and the passport session for 
//Session data w/ google auth
app.use(passport.initialize());
app.use(passport.session());
//Sending data from front end to back end with json in expres
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride("_method"));
//
app.use(express.static('public'));
app.set('view engine', 'ejs');


//Connect to our db
connectDB();
//Outsource our routing to routing folder and files
app.use('/', require('./server/routes/auth'));
app.use('/', require('./server/routes/router'));


//For rendering bad requests
app.get('*', function(req, res) {
  res.status(404).render('404');
})

//Deploy to port
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});