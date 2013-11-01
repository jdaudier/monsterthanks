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
  width: {type: Number, default: 100},
  height: {type: Number, default: 100},
  speechBubble: {top : Number, left : Number}
});

// speechBubble.top to write to it

var Monster = mongoose.model('Monster', monsterSchema);

// Initialize 50 monsters whenever a Card is created
var Card = mongoose.model('Card', {
  monsters: {
    type: [monsterSchema],
    default: function(){
      var monstersArray = [];
      for (var i = 1; i < 51; i++) {
        monstersArray.push(new Monster({}));
      }
      return monstersArray;
    },
    background: {type: String, default: "backyard.jpg"}
  }
});

exports.Card = Card;