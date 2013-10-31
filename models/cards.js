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

var monster1 = new Monster({
  top: 20,
  left: 20
});

var monster2 = new Monster({
  top: 20,
  left: 140
});

var monster3 = new Monster({
  top: 144.8000030517578,
  left: 20
});

var monster4 = new Monster({
  top: 144.8000030517578,
  left: 140
});

var monster5 = new Monster({
  top: 269.6000061035156,
  left: 20
});

var monster6 = new Monster({
  top: 269.6000061035156,
  left: 140
});

var monster7 = new Monster({
  top: 394.3999938964844,
  left: 20
});

var monster8 = new Monster({
  top: 394.3999938964844,
  left: 140
});

var monster9 = new Monster({
  top: 519.2000122070312,
  left: 20
});

var monster10 = new Monster({
  top: 519.2000122070312,
  left: 140
});

var monster11 = new Monster({
  top: 644,
  left: 20
});

var monster12 = new Monster({
  top: 644,
  left: 140
});

var monster13 = new Monster({
  top: 768.7999877929688,
  left: 20
});

var monster14 = new Monster({
  top: 768.7999877929688,
  left: 140
});

var monster15 = new Monster({
  top: 893.6000366210938,
  left: 20
});

var monster16 = new Monster({
  top: 893.6000366210938,
  left: 140
});

var monster17 = new Monster({
  top: 1018.4000244140625,
  left: 20
});

var monster18 = new Monster({
  top: 1018.4000244140625,
  left: 140
});

var monster19 = new Monster({
  top: 1143.2000732421875,
  left: 20
});

var monster20 = new Monster({
  top: 1143.2000732421875,
  left: 140
});

var monster21 = new Monster({
  top: 1268,
  left: 20
});

var monster22 = new Monster({
  top: 1268,
  left: 140
});

var monster23 = new Monster({
  top: 1392.800048828125,
  left: 20
});

var Card = mongoose.model('Card', {
  monsters: {type: [monsterSchema], default: [monster1, monster2, monster3, monster4, monster5, monster6, monster7, monster8, monster9, monster10, monster11, monster12, monster13, monster14, monster15,monster16, monster17, monster18, monster19, monster20, monster21, monster22, monster23]},
  background: String
});

exports.Card = Card;