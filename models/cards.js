var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var monsterSchema = new Schema({
  top: Number,
  left: Number,
  width: {type: Number, default: 100},
  height: {type: Number, default: 100},
  speechBubble: {
    top : Number,
    left : Number,
    message: String
  }
});

// speechBubble.top to write to it

var Monster = mongoose.model('Monster', monsterSchema);

var cardSchema = new Schema({
  monsters: {type: Schema.Types.Mixed},
  background: {type: String, default: "backyard.jpg"}
});

// Initialize 50 monsters whenever a Card is created

cardSchema.path('monsters').default(function(){
  var monstersArray = [];
  for (var i = 1; i < 51; i++) {
    monstersArray.push(new Monster({}));
    console.log(monstersArray);
  }
  return monstersArray;
});

var Card = mongoose.model('Card', cardSchema);

exports.Card = Card;