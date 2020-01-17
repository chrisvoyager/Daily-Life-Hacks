require("dotenv").config();
var express = require("express");
var exphbs = require("express-handlebars");
var nodemailer = require('nodemailer');
var schedule = require('node-schedule');


var db = require("./models");

var app = express();
var PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  app.listen(PORT, function() {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

module.exports = app;

//Nodemailer
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'thedailylifehack@gmail.com',
    pass: 'hackmylife123'
  }
});

var mailOptions = {
  from: 'thedailylifehack@gmail.com',
  to: 'rasilverthorn@ucdavis.edu, chriscoonwilliam@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};



//Node-schedule
var j = schedule.scheduleJob('5 19 20 16 1 4', function(){
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  console.log('Scheduled!');
});