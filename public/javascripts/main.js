var socket = io.connect();

$(function domReady() {

  // Creates a new Card
  $(".action-btn").click(function(e) {
    window.location.href = "/new";
  });

  $.localScroll();

  socket.on("connect", function(){
    // Gets position of a monster after dragstop
    $(".draggable").draggable({
      scroll: true,
      containment: "window",
      // start: function( event, ui ) {

      // },
      stop: function( event, ui ) {
        var top = $(this).offset().top;
        var left = $(this).offset().left;
        var docHeight = $(document).height();
        var docWidth = $(document).width();
        var topPercent = top / docHeight * 100;
        var leftPercent = left / docWidth * 100;
        // console.log("top: ", top);
        // console.log("left: ", left);
        // console.log("top%: ", topPercent);
        // console.log("left%: ", leftPercent);

        var monsterId = $(this).find(".monster").data("id");
        var cardId = $(this).find(".monster").data("card-id");

        var draggedMonster = {
          id: cardId,
          monsterId: monsterId,
          top: topPercent,
          left: leftPercent
        };

        socket.emit("draggedMonster", draggedMonster);
      }
    });
  });

  // Gets size of monster after resizing
  $(".monster").resizable({
    stop: function( event, ui ) {
      var width = $(this).width();
      var height = $(this).height();
      var docWidth = $(document).width();
      var docHeight = $(document).height();
      var widthPercent = width / docWidth * 100;
      var heightPercent = height / docHeight * 100;
      var monsterId = $(this).find(".monster").data("id");
      // console.log("width: ", width);
      // console.log("height: ",height);
      // console.log("docWidth: ",docWidth);
      // console.log("docHeight: ",docHeight);
      // console.log("widthPercent: ",widthPercent);
      // console.log("heightPercent: ",heightPercent);
      var cardId = $(this).find(".monster").data("card-id");

      var resizedMonster = {
        id: cardId,
        monsterId: monsterId,
        width: widthPercent,
        height: heightPercent
      };

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
    $(bubbleTemplate).prependTo($(this));
    $(this).addClass("has-bubble");
    $(".draggable-bubble").draggable({
      scroll: true,
      containment: ".background",
      // start: function( event, ui ) {

      // },
      stop: function( event, ui ) {
        // $(this) = bubble div
        var top = $(this).offset().top;
        var left = $(this).offset().left;
        var docHeight = $(document).height();
        var docWidth = $(document).width();
        var topPercent = top / docHeight * 100;
        var leftPercent = left / docWidth * 100;
        console.log("top: ", top);
        console.log("left: ", left);
        console.log("top%: ", topPercent);
        console.log("left%: ", leftPercent);

        var monsterId = $monsterImg.data("id");
        var cardId = $monsterImg.data("card-id");

        var draggedBubble = {
          id: cardId,
          monsterId: monsterId,
          top: topPercent,
          left: leftPercent
        };

        // console.log("draggedBubble: ", draggedBubble);
        socket.emit("draggedBubble", draggedBubble);

      }
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

      // console.log("messageEntered: ", messageEntered);
      socket.emit("messageEntered", messageEntered);

    });
  });

  // $('.message').on('keyup', function(e) {
  //   $el = $(this);
  //   if(e.which === 13) {
  //     socket.emit('message', $el.val());
  //   }
  // });














});