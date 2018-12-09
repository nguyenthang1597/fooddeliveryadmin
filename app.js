const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const pg = require("./app/config/pg");
const app = express();
const passport = require("passport");
const firebase = require('firebase');
var config = {
  appId: "1:413834109009:android:0146280af0ce712c",
  apiKey: "AIzaSyCaswdFpvrdHXcsnq2Q7mRqjuWIgiFgyCI",
  authDomain: "fooddeliveryadmin-32946.firebaseapp.com",
  databaseURL: "https://fooddeliveryadmin-32946.firebaseio.com",
  projectId: "fooddeliveryadmin-32946",
  storageBucket: "fooddeliveryadmin-32946.appspot.com",
  messagingSenderId: "413834109009"
};
firebase.initializeApp(config);


app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());

require("./app/config/passport")(passport);
pg.connect().catch(err => console.log(err))
require("./routes")(app);

process.on('uncaughtException', (err) => {
  console.error('There was an uncaught error', err)
  process.exit(1) //mandatory (as per the Node docs)
})
module.exports = app;
