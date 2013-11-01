
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var socketio = require('socket.io');

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

// Create the server
var server = http.createServer(app);

//Start the web socket server
var io = socketio.listen(server);

// Mongoose
//Create to the DB if it doesn't exist and connect to it
var mongoose = require('mongoose');
mongoURI = process.env.MONGOHQ_URL || 'mongodb://localhost/monsterthanks';
mongoose.connect(mongoURI);
//setup our MongoDB Card collection
var models = require('./models/cards');


app.get('/', routes.index);
// app.get('/users', user.list);

app.get('/new', function(req, res){
  //Create a new Card document
  var card = new models.Card({ monsters: [], background: "backyard.jpg" });

  // Create 50 monsters
  // Write their location and size
  // Drag or resize event - update DB
  // Mongoose $push to add to the monsters array

  var id = card._id;
  var path = "/edit/" + id;
  //Save the Card document
  card.save(function(){
    res.redirect(path);
  });
});


app.get('/edit/:id', function(req, res) {
  res.render('card');
});

io.sockets.on('connection', function(socket) {
  // users[socket.id] = socket.id;

  // io.sockets.emit('connectedMsg', {
  //   user: users[socket.id],
  //   message: " just joined the room!"
  // });
  // //socket is the specific connection that's fired
  // socket.on('clientMsg', function(message){
  //   io.sockets.emit('serverMsg', {
  //     user: users[socket.id],
  //     message: message
  //   });
  // });

  // socket.on('disconnect', function () {
  //   io.sockets.emit('disconnectedMsg', {
  //   user: users[socket.id],
  //   message: " just left the room. Boo!"});
  //   delete users[socket.id];
  //   io.sockets.emit('users', users);
  // });

  // socket.on('username', function(username) {
  //   users[socket.id] = username;
  //   io.sockets.emit('users', users);
  // });

  // io.sockets.emit('users', users);

});



server.listen(3000, function(){
  console.log('Express server listening on port ' + app.get('port'));
});