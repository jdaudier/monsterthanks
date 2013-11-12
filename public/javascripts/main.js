var socket = io.connect();

$(function domReady() {

  var convertToAbsoluteTop = function(docHeight, topPercent) {
    return (docHeight * topPercent) / 100;
  };

  var convertToAbsoluteLeft = function(docWidth, leftPercent) {
    return (docWidth * leftPercent) / 100;
  };

  var convertToAbsoluteWidth = function(docWidth, widthPercent) {
    return (docWidth * widthPercent) / 100;
  };

  var convertToAbsoluteHeight = function(docHeight, heightPercent) {
    return (docHeight * heightPercent) / 100;
  };

  // CREATING A NEW CARD
  $(".action-btn").click(function(e) {
    window.location.href = "/new";
  });

  $.localScroll();

  // RENDERING MONSTERS TO THEIR SAVED LOCATIONS ON LOAD
  socket.on("connect", function(){
    var cardId = $('.draggable:first .monster').data("card-id");
    socket.emit("cardId", cardId);

    socket.on('cardLoaded', function(card){
      // console.log(card);
      var cardId = $('.draggable:first .monster').data("card-id");
      var docHeight = $(document).height();
      var docWidth = $(document).width();

      if (card) {
        var newBackground = card.background;
        for (var i = 0; i < card.monsters.length; i++) {
          if (card.monsters[i].top && card._id === cardId || card.monsters[i].height && card._id === cardId) {
            $('.monster').each(function(index, element){
              // element = this (monster img)
              if (index === card.monsters[i].monsterId) {
                var renderTop = convertToAbsoluteTop(docHeight, card.monsters[i].top);
                var renderLeft = convertToAbsoluteLeft(docWidth, card.monsters[i].left);
                var renderWidth = convertToAbsoluteWidth(docWidth, card.monsters[i].width);
                var renderHeight = convertToAbsoluteHeight(docHeight, card.monsters[i].height);
                // console.log("monster width: ", card.monsters[i].width);
                // console.log("monster height: ", card.monsters[i].height);

                $(element).parents(".draggable").css({"position": "absolute", "top": renderTop + "px", "left": renderLeft + "px"});
                $(element).height(renderHeight);
                $(element).width(renderWidth);
                $(element).parent().css({"height": renderHeight + "px", "width": renderWidth + "px"});
                $(element).removeClass('jiggly');
                // console.log("ON LOAD renderTop: ", renderTop);
                // console.log("ON LOAD renderLeft: ", renderLeft);
                // console.log("ON LOAD renderWidth: ", renderWidth);
                // console.log("ON LOAD renderHeight: ", renderHeight);
              }
            });
          }

          if (card.monsters[i].speechBubble && card._id === cardId) {
            $('.monster').each(function(index, element){
              // element = this (monster img)

              if (index === card.monsters[i].monsterId) {
                var source = $("#speech-bubble").html();
                var bubbleTemplate = Handlebars.compile (source);
                var messageObj = {
                  messageEntered: card.monsters[i].speechBubble
                };
                bubbleTemplate = bubbleTemplate(messageObj);
                $(element).parent().prev().html(bubbleTemplate);
              }
            });
          }

          if (card.background && card._id === cardId) {
            $('.background').css({
              'background': 'url(../images/backgrounds/' + newBackground + '.png)',
              'background-size': '100% 100%',
              'background-repeat': 'no-repeat'
            });
          }
        }
      }
    });

    // GETTING POSITION OF A MONSTER WHILE DRAGGING
    $(".draggable").draggable({
      scroll: true,
      // containment: "window",
      start: function( event, ui) {
        $(this).find(".monster").removeClass('jiggly');
      },
      drag: function( event, ui ) {
        var top = ui.offset.top;
        var left = ui.offset.left;
        var docHeight = $(document).height();
        var docWidth = $(document).width();
        var topPercent = (top / docHeight) * 100;
        var leftPercent = (left / docWidth) * 100;
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

  // RERENDERING MONSTER LOCATION WHENEVER IT'S MOVED
  socket.on('cardSaved', function(card){
    var cardId = $('.draggable:first .monster').data("card-id");
    var docHeight = $(document).height();
    var docWidth = $(document).width();

    for (var i = 0; i < card.monsters.length; i++) {
      if (card.monsters[i].top && card._id === cardId || card.monsters[i].height && card._id === cardId || card.monsters[i].speechBubble && card._id === cardId) {
        $('.monster').each(function(index, element){
          // element = this (monster img)
          if (index === card.monsters[i].monsterId) {
            var renderTop = convertToAbsoluteTop(docHeight, card.monsters[i].top);
            var renderLeft = convertToAbsoluteLeft(docWidth, card.monsters[i].left);
            var renderWidth = convertToAbsoluteWidth(docWidth, card.monsters[i].width);
            var renderHeight = convertToAbsoluteHeight(docHeight, card.monsters[i].height);
            $(element).parents(".draggable").css({"position": "absolute", "top": renderTop + "px", "left": renderLeft + "px"});
            $(element).height(renderHeight);
            $(element).width(renderWidth);
            $(element).parent().css({"height": renderHeight + "px", "width": renderWidth + "px"});
            $(element).removeClass('jiggly');
            // console.log("ON CARD SAVE renderTop: ", renderTop);
            // console.log("ON CARD SAVE renderLeft: ", renderLeft);
            // console.log("ON CARD SAVE renderWidth: ", renderWidth);
            // console.log("ON CARD SAVE renderHeight: ", renderHeight);
          }
        });
      }
    }
  });

  // SHOWING THE MESSAGES AS USERS ARE TYPING
  socket.on('msgSaved', function(card){
    var cardId = $('.draggable:first .monster').data("card-id");

    for (var i = 0; i < card.monsters.length; i++) {
      if (card.monsters[i].speechBubble && card._id === cardId) {
        $('.monster').each(function(index, element){
          // element = this (monster img)
          if (index === card.monsters[i].monsterId) {
            var source = $("#speech-bubble").html();
            var bubbleTemplate = Handlebars.compile (source);
            var messageObj = {
              messageEntered: card.monsters[i].speechBubble
            };
            bubbleTemplate = bubbleTemplate(messageObj);

            $(element).parent().prev().html(bubbleTemplate);
          }
        });
      }
    }
  });

  // GETTING THE SIZE OF THE MONSTER WHILE THEY'RE RESIZED
  $(".monster").resizable({
    resize: function( event, ui ) {
      var width = ui.size.width;
      var height = ui.size.height;
      var docWidth = $(document).width();
      var docHeight = $(document).height();
      var widthPercent = (width / docWidth) * 100;
      var heightPercent = (height / docHeight) * 100;
      var $monsterImg = $(this).find(".monster");
      var monsterId = $monsterImg.data("id");
      // console.log("resized width: ", width);
      // console.log("resized height: ",height);
      // console.log("docWidth: ", docWidth);
      // console.log("docHeight: ", docHeight);
      // console.log("resized widthPercent: ", widthPercent);
      // console.log("resized heightPercent: ", heightPercent);

      // $monsterImg.parent().css({"position": "absolute", "top": 0, "left": 0});

      var cardId = $monsterImg.data("card-id");
      var resizedMonster = {
        id: cardId,
        monsterId: monsterId,
        width: widthPercent,
        height: heightPercent
      };
      // console.log("resizedMonster: ", resizedMonster);
      socket.emit("resizedMonster", resizedMonster);
    }
  });

  // $(".background").droppable({
  //   drop: function() {
  //   }
  // });

  // ADDING SPEECH BUBBLES
  $(".draggable").dblclick(function(e) {
    // console.log(e);
    // console.log($(this));
    var $monsterImg = $(e.target);

    // $(this) = draggable div
    if ($(e.target).hasClass("monster")===false || $(this).hasClass("has-bubble")===true || $(this).children().children().hasClass("bubble")===true) {
      return false; // Limit 1 speech bubble per monster
    }

    var source = $("#editable-speech-bubble").html();
    var bubbleTemplate = Handlebars.compile (source);
    var messageObj = {
      defaultMsg: "Enter your message"
    };
    bubbleTemplate = bubbleTemplate(messageObj);

    $monsterImg.parent().prev().html(bubbleTemplate);

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
      // console.log("messageEntered: ", messageEntered);
      socket.emit("messageEntered", messageEntered);
    });

    $(".message").blur(function() {
      $el = $(this); // This is the textarea
      var message = $el.val();
      $el.parent().parent().text(message);
    });

  }); // END OF ADDING A SPEECH BUBBLE

  // EDITING A SPEECH BUBBLE
  $('.bubble-container').dblclick(function(e) {
    // $(this) = .bubble-container div
    var $monsterImg = $(this).parent().find('.monster');
    var $draggableDiv = $(this).parent();
    var oldMsg = $(this).children().text();

    var source = $('#editable-speech-bubble').html();
    var bubbleTemplate = Handlebars.compile (source);
    var messageObj = {
      defaultMsg: "Enter your message"
    };
    bubbleTemplate = bubbleTemplate(messageObj);
    $(this).html(bubbleTemplate);

    $draggableDiv.addClass("has-bubble");

    var $textArea = $(this).find('.message');
    $textArea.val(oldMsg);

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

      // console.log("messageEntered: ", messageEntered);
      socket.emit("messageEntered", messageEntered);
    });

    $(".message").blur(function() {
      $el = $(this); // This is the textarea
      var message = $el.val();

      if (message === "") {
        $el.parent().parent().text(oldMsg);
      }
      else {
        $el.parent().parent().text(message);
      }
    });

  }); // END OF EDITING A SPEECH BUBBLE

  // CHANGING BACKGROUNDS ON RIGHT ARROW CLICK
  $('#right-arrow').click(function(){
    var cardId = $('.draggable:first .monster').data("card-id");
    var backgroundUrl = $(this).parent().css('background-image');
    // The lastIndexOf() method returns the position of the last occurrence of a specified value in a string.
    var slash = backgroundUrl.lastIndexOf("/");
    var period = backgroundUrl.lastIndexOf(".");
    var filename = backgroundUrl.substring(slash+1, period);
    var currentCard = {
      id: cardId,
      background: filename
    };
    // console.log("backgroundChanged: ", backgroundChanged);
    socket.emit("rightArrowClicked", currentCard);
  });

  // CHANGING BACKGROUNDS ON LEFT ARROW CLICK
  $('#left-arrow').click(function(){
    var cardId = $('.draggable:first .monster').data("card-id");
    var backgroundUrl = $(this).parent().css('background-image');
    // The lastIndexOf() method returns the position of the last occurrence of a specified value in a string.
    var slash = backgroundUrl.lastIndexOf("/");
    var period = backgroundUrl.lastIndexOf(".");
    var filename = backgroundUrl.substring(slash+1, period);
    var currentCard = {
      id: cardId,
      background: filename
    };
    // console.log("backgroundChanged: ", currentCard);
    socket.emit("leftArrowClicked", currentCard);
  });

  // RELOAD BACKGROUND IMAGE WHENEVER IT'S CHANGED
  socket.on('backgroundSaved', function(card){
    var cardId = $('.draggable:first .monster').data("card-id");
    var newBackground = card.background;
    if (card._id === cardId) {
      $('.background').css({
        'background': 'url(../images/backgrounds/' + newBackground + '.png)',
        'background-size': '100% 100%',
        'background-repeat': 'no-repeat',
      });
    }
  });





});