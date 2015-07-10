var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var port = process.env.PORT || 8088; // set our port

var app = express();
//~ app.set('views', path.join(__dirname, 'views'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
require('./app/routes')(app); 
app.use(function(req, res) {
  res.sendfile(__dirname + '/public/index.html');
});
// start app ===============================================
app.listen(port); 
console.log('App is Running On Port : ' + port); 
module.exports = app;
