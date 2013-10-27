
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// MongoDB
//Create to the DB if it doesn't exist and connect to it
mongoose.connect('mongodb://localhost/monsterthanks');

//setup our MongoDB Card collection
var Card = mongoose.model('Card', {
  name: String
});

app.get('/', routes.index);
// app.get('/users', user.list);

app.get('/new', function(req, res){
  //Create a new Card document
  var card = new Card({ name: "Test" });
  var id = card._id;
  var path = "/" + id;
  //Save the Card document
  card.save(function(){
    res.redirect(path);
  });
});


app.get('/:id', function(req, res) {
  res.render('card');
});



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});