
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

// All environments
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

// Development only
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

var Card = mongoose.model("Card", models.cardSchema);
var Monster = mongoose.model("Monster", models.monsterSchema);

app.get('/', routes.index);
// app.get('/users', user.list);

app.get('/new', function(req, res){
  //Create a new Card document
  var card = new models.Card();

  // Initialize 50 monsters whenever a Card is created
  for (var i = 0; i < 50; i++) {
    card.monsters.push(new Monster({monsterId: i}));
  }

  var id = card._id;
  var path = "/edit/" + id;
  //Save the Card document
  card.save(function(err){
    if (err) {
      res.send(500, "Card is NOT saved");
    }
    else {
      res.redirect(path);
    }
  });
});

app.get('/edit/:id', function(req, res) {
  Card.findOne({_id: req.params.id}, function(err, card){
    res.render('card', card);
  });

});

io.sockets.on('connection', function(socket) {
  // users[socket.id] = socket.id;
  socket.on('cardId', function(cardId) {
    Card.findOne({_id: cardId}, function(err, card){
      if (err) {
        res.send(500, "Card is NOT found");
      }
      else {
        io.sockets.emit('cardLoaded', card);
      }
    });
  });

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

  socket.on('draggedMonster', function(draggedMonster) {

    Card.findOne({_id: draggedMonster.id}, function(err, card){
      for (var i = 0; i < card.monsters.length; i++) {
        if (card.monsters[i].monsterId === draggedMonster.monsterId) {
          card.monsters[i].top = draggedMonster.top;
          card.monsters[i].left = draggedMonster.left;
          // console.log("found monster: ", card.monsters[i]);
          card.save(function (err, card) {
            if (err) {
              res.send(500, "Monster's new position is NOT saved");
            }
            else {
              console.log("Card saved: ", card);

              io.sockets.emit('cardSaved', card);

              // card = {
              //   __v: 0,
              //   _id: 52799a4a7776e20000000002,
              //   createdAt: Tue Nov 05 2013 18:24:26 GMT-0700 (MST),
              //   background: 'backyard.jpg',
              //   monsters:
              //     [ { _id: 52799a4a7776e20000000003,
              //       left: 25.905511811023622,
              //       monsterId: 0,
              //       top: 41.77274870344178,
              //       height: 100,
              //       width: 100
              //     },

            }
          });

  //   io.sockets.emit('serverMsg', {
  //     user: users[socket.id],
  //     message: message
  //   });

        }
      }
    });
  });

  socket.on('resizedMonster', function(resizedMonster) {

    Card.findOne({_id: resizedMonster.id}, function(err, card){
      for (var i = 0; i < card.monsters.length; i++) {
        if (card.monsters[i].monsterId === resizedMonster.monsterId) {
          card.monsters[i].width = resizedMonster.width;
          card.monsters[i].height = resizedMonster.height;
          // console.log("found monster: ", card.monsters[i]);
          card.save();
          // io.sockets.emit('users', users);
        }
      }
    });
  });

  socket.on('messageEntered', function(messageEntered) {

    Card.findOne({_id: messageEntered.id}, function(err, card){
      for (var i = 0; i < card.monsters.length; i++) {
        if (card.monsters[i].monsterId === messageEntered.monsterId) {
          card.monsters[i].speechBubble = messageEntered.message;
          // console.log("found monster: ", card.monsters[i]);
          card.save();
          // io.sockets.emit('users', users);
        }
      }
    });
  });






}); // Socket connection CLOSES

server.listen(3000, function(){
  console.log('Express server listening on port ' + app.get('port'));
});