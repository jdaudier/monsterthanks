var socket = io.connect();

$(function domReady() {

  // Creates a new Card
  $(".action-btn").click(function(e) {
    window.location.href = "/new";
  });

  $.localScroll();

  socket.on("connect", function(){
    // Gets position of a monster during the dragging
    $(".draggable").draggable({
      scroll: true,
      containment: "window",
      drag: function( event, ui ) {
        var top = ui.offset.top;
        var left = ui.offset.left;
        var docHeight = $(document).height();
        var docWidth = $(document).width();
        var topPercent = top / docHeight * 100;
        var leftPercent = left / docWidth * 100;
        // console.log("dragged top: ", top);
        // console.log("dragged left: ", left);
        // console.log("dragged top%: ", topPercent);
        // console.log("dragged left%: ", leftPercent);

        var monsterId = $(this).find(".monster").data("id");
        var cardId = $(this).find(".monster").data("card-id");

        var draggedMonster = {
          id: cardId,
          monsterId: monsterId,
          top: topPercent,
          left: leftPercent
        };

        // console.log("draggedMonster: ", draggedMonster);

        socket.emit("draggedMonster", draggedMonster);
      }
    });
  });

  var convertToAbsoluteHeight = function(docHeight, topPercent) {
    return (docHeight * topPercent)/100;
  };

  var convertToAbsoluteWidth = function(docWidth, leftPercent) {
    return (docWidth * leftPercent)/100;
  };

  socket.on('savedCard', function(card){
    // console.log(card);

    // Need to find the 1st monster
    console.log($('.monster-container .draggable:nth-of-type(1)'));

    // for (var i = 0; i < card.monsters.length; i++) {
    //   if (card.monsters[i].width) {

    //   }

    // };
    // if there's height and width % & id = id, monster id = monster id
    // do calculation to convert to top & left position
    // render image

  });

  // Gets size of monster during the resizing
  $(".monster").resizable({
    resize: function( event, ui ) {
      var width = ui.size.width;
      var height = ui.size.height;
      var docWidth = $(document).width();
      var docHeight = $(document).height();
      var widthPercent = width / docWidth * 100;
      var heightPercent = height / docHeight * 100;
      var monsterId = $(this).find(".monster").data("id");
      // console.log("resized width: ", width);
      // console.log("resized height: ",height);
      // console.log("docWidth: ", docWidth);
      // console.log("docHeight: ", docHeight);
      // console.log("resized widthPercent: ", widthPercent);
      // console.log("resized heightPercent: ", heightPercent);
      var cardId = $(this).find(".monster").data("card-id");

      var resizedMonster = {
        id: cardId,
        monsterId: monsterId,
        width: widthPercent,
        height: heightPercent
      };

      console.log("resizedMonster: ", resizedMonster);
      socket.emit("resizedMonster", resizedMonster);

    }
  });

  // $(".background").droppable({
  //   drop: function() {
  //   }
  // });

  // Adding speech bubbles
  $(".draggable").dblclick(function(e) {

    var $monsterImg = $(e.target);
    // if ($(e.target).hasClass("bubble")===true) {
    //   alert("hi")
    // }

    if ($(e.target).hasClass("monster")===false || $(this).hasClass("has-bubble")===true) {
      return false; // Limit 1 speech bubble per monster
    }
    var source = $("#speech-bubble").html();
    var bubbleTemplate = Handlebars.compile (source);
    var messageObj = {
      defaultMsg: "Enter your message"
    };
    bubbleTemplate = bubbleTemplate(messageObj);
    //$(this) = draggable div
    $(bubbleTemplate).prependTo($(this));

    $(this).addClass("has-bubble");

    $('.message').on('keyup', function() {
      $el = $(this); // This is the textarea
      var message = $el.val();
      var monsterId = $monsterImg.data("id");
      var cardId = $monsterImg.data("card-id");

      var messageEntered = {
        id: cardId,
        monsterId: monsterId,
        message: message
      };

      console.log("messageEntered: ", messageEntered);
      socket.emit("messageEntered", messageEntered);
    });

    $(".message").blur(function() {
      $el = $(this); // This is the textarea
      var message = $el.val();
      $el.parent().parent().text(message);

      var monsterId = $monsterImg.data("id");
      var cardId = $monsterImg.data("card-id");

      var messageEntered = {
        id: cardId,
        monsterId: monsterId,
        message: message
      };

      console.log("messageEntered: ", messageEntered);
      socket.emit("messageEntered", messageEntered);
    });

  }); // End of adding a speech bubble













});