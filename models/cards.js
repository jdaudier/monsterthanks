var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// var bubbleSchema = new Schema({
//   top: Number,
//   left: Number
// });

// var Bubble = mongoose.model('Bubble', bubbleSchema);

var monsterSchema = new Schema({
  top: Number,
  left: Number,
  width: Number,
  height: Number,
  speechBubble: {top : Number, left : Number}
});

// speechBubble.top to write to it

var Monster = mongoose.model('Monster', monsterSchema);

var Card = mongoose.model('Card', {
  monsters: [monsterSchema],
  background: String
});

exports.Card = Card;