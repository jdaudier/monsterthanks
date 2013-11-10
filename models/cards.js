var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var monsterSchema = new Schema({
  monsterId: Number,
  top: Number,
  left: Number,
  width: Number,
  height: Number,
  speechBubble: String
});

// speechBubble.top to write to it

var Monster = mongoose.model('Monster', monsterSchema);

var cardSchema = new Schema({
  monsters: {type: [monsterSchema], default: []},
  background: {type: String, default: "backyard"},
  createdAt: {
    type: Date,
    default: Date.now
  }
});

var Card = mongoose.model('Card', cardSchema);

exports.Monster = Monster;
exports.Card = Card;