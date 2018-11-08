const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const pg = require("./app/config/pg");
const app = express();
const passport = require("passport");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());

require("./app/config/passport")(passport);
pg.connect(err => {
  if (err) console.log("Error: connect to DB.");
  else console.log("Conneted to DB");
});
require("./routes")(app);

process.on('uncaughtException', (err) => {
  console.error('There was an uncaught error', err)
  process.exit(1) //mandatory (as per the Node docs)
})
module.exports = app;
