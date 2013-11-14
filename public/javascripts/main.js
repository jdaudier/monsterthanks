var socket = io.connect();

$(function domReady() {

  var convertToAbsoluteTop = function(docHeight, topPercent){
    return docHeight * (topPercent / 100);
  };

  var convertToAbsoluteLeft = function(docWidth, leftPercent){
    return docWidth * (leftPercent / 100);
  };

  var convertToAbsoluteWidth = function(docWidth, widthPercent){
    return docWidth * (widthPercent / 100);
  };

  var convertToAbsoluteHeight = function(docHeight, heightPercent){
    return docHeight * (heightPercent / 100);
  };

  // CREATING A NEW CARD
  $(".action-btn").click(function(e){
    window.location.href = "/new";
  });

  $.localScroll();

  // RENDERING MONSTERS TO THEIR SAVED LOCATIONS ON LOAD
  socket.on("connect", function(){
    $('#myModal').modal({
      keyboard: false,
      backdrop: 'static'
    });

    var cardId = $('.draggable:first .monster').data("card-id");
    socket.emit("cardId", cardId);

    socket.on('cardLoaded', function(card){
      // console.log(card);
      var cardId = $('.draggable:first .monster').data("card-id");
      var docHeight = $('.background').height();
      var docWidth = $('.background').width();

      if (card) {
        var newBackground = card.background;
        var recipient = card.recipient;

        for (var i = 0; i < card.monsters.length; i++) {
          if (card.monsters[i].top && card._id === cardId || card.monsters[i].height && card._id === cardId) {
            $('.monster').each(function(index, element){
              // element = this (monster img)
              if ($(this).data('id') === card.monsters[i].monsterId) {
                var renderTop = convertToAbsoluteTop(docHeight, card.monsters[i].top);
                var renderLeft = convertToAbsoluteLeft(docWidth, card.monsters[i].left);
                var renderWidth = convertToAbsoluteWidth(docWidth, card.monsters[i].width);
                var renderHeight = convertToAbsoluteHeight(docHeight, card.monsters[i].height);
                // console.log("monster width: ", card.monsters[i].width);
                // console.log("monster height: ", card.monsters[i].height);

                var draggableDiv = $(element).parents(".draggable").detach();
                $('.background').append(draggableDiv);
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

          if (card.monsters[i].speechBubble && card._id === cardId){
            $('.monster').each(function(index, element){
              // element = this (monster img)

              if ($(this).data('id') === card.monsters[i].monsterId){
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

          if (card.background && card._id === cardId){
            $('.background').css({
              'background': 'url(../images/backgrounds/' + newBackground + '.png)',
              'background-size': '100% 100%',
              'background-repeat': 'no-repeat'
            });
          }
        }

        if (card.recipient) {
          $('.recipient').text(recipient);
          $('.recipient-input').hide();
        }

        // GETTING RECIPIENT NAME
        var capitalizeFirstLetter = function(recipient){
          return recipient.charAt(0).toUpperCase() + recipient.slice(1);
        };

        $('form').submit(function(e){
          e.preventDefault();
        });

        if (!card.recipient) {
          $('.recipient-input').on('keyup', function(e){
            $el = $(this);
            if(e.which === 13){
              var recipientName = $(this).val();
              recipientName = capitalizeFirstLetter(recipientName);
              var recipient = {
                id: cardId,
                name: recipientName
              };
              socket.emit("recipientEntered", recipient);
              $('.close-modal-btn').trigger('click');
            }
          });

          $('.close-modal-btn').click(function(e){
            var $inputField = $(this).prev();
            var recipientName = $inputField.val();

            if (recipientName === ''){
              $inputField.addClass('recipient-input-error animated flash');
              return false;
            }

            recipientName = capitalizeFirstLetter(recipientName);
            var recipient = {
              id: cardId,
              name: recipientName
            };
            socket.emit("recipientEntered", recipient);
          });
        }
      }
    });

    // GETTING POSITION OF A MONSTER WHILE DRAGGING
    $(".draggable").draggable({
      scroll: true,
      containment: "window",
      // appendTo: ".background",
      start: function( event, ui){
        $(this).find(".monster").removeClass('jiggly');
      },
      drag: function( event, ui ){
        var top = ui.position.top;
        var left = ui.position.left;
        var docHeight = $('.background').height();
        var docWidth = $('.background').width();
        // console.log("dragged top: ", top);
        // console.log("dragged left: ", left);
        // console.log("dragged top%: ", topPercent);
        // console.log("dragged left%: ", leftPercent);

        if (!$(this).parent().is('.background')){
          top = $(this).offset().top - 12;
          top -= $('.background').offset().top;
          left = $(this).offset().left - 12;
          left -= $('.background').offset().left;
        }

        var topPercent = (top / docHeight) * 100;
        var leftPercent = (left / docWidth) * 100;
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
      },
      // ADDING DRAGGING SOUND
      stop: function( event, ui ) {
        $('.entrance-sound').get(0).play();
      }
    });
  });

  // RE-RENDERING MONSTER LOCATION WHENEVER IT'S MOVED
  socket.on('cardSaved', function(card){
    var cardId = $('.draggable:first .monster').data("card-id");
    var docHeight = $('.background').height();
    var docWidth = $('.background').width();

    for (var i = 0; i < card.monsters.length; i++){
      if (card.monsters[i].top && card._id === cardId || card.monsters[i].height && card._id === cardId || card.monsters[i].speechBubble && card._id === cardId) {
        $('.monster').each(function(index, element){
          // element = this (monster img)
          if ($(this).data('id') === card.monsters[i].monsterId) {
            var renderTop = convertToAbsoluteTop(docHeight, card.monsters[i].top);
            var renderLeft = convertToAbsoluteLeft(docWidth, card.monsters[i].left);
            var renderWidth = convertToAbsoluteWidth(docWidth, card.monsters[i].width);
            var renderHeight = convertToAbsoluteHeight(docHeight, card.monsters[i].height);
            $(element).parents(".draggable").css({"position": "absolute", "top": renderTop + "px", "left": renderLeft + "px"});
            $(element).height(renderHeight);
            $(element).width(renderWidth);
            $(element).parent().css({"height": renderHeight + "px", "width": renderWidth + "px"});
            $(element).removeClass('jiggly');

            if (!$(this).closest('.draggable').parent().is('.background')) {
              var draggableDiv = $(element).parents(".draggable").detach();
              $('.background').append(draggableDiv);
            }
            // console.log("ON CARD SAVE renderTop: ", renderTop);
            // console.log("ON CARD SAVE renderLeft: ", renderLeft);
            // console.log("ON CARD SAVE renderWidth: ", renderWidth);
            // console.log("ON CARD SAVE renderHeight: ", renderHeight);
          }
        });
      }
      if (card.monsters[i].top && card._id === cardId){
        $('.entrance-sound').get(0).play();
      }
    }
  });

  // SHOWING THE MESSAGES AS USERS ARE TYPING
  socket.on('msgSaved', function(card){
    var cardId = $('.draggable:first .monster').data("card-id");

    for (var i = 0; i < card.monsters.length; i++) {
      if (card.monsters[i].speechBubble && card._id === cardId){
        $('.monster').each(function(index, element){
          // element = this (monster img)
          if ($(this).closest('.draggable').hasClass('writing')){
            return false;
          }

          if ($(this).data('id') === card.monsters[i].monsterId){
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
    resize: function( event, ui ){
      var width = ui.size.width;
      var height = ui.size.height;
      var docWidth = $('.background').width();
      var docHeight = $('.background').height();
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

  // ADDING SPEECH BUBBLES
  $(".draggable").dblclick(function(e){
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

    // ADDING TYPING SOUND
    $('.message').on('keydown', function(){
      $('.typing-sound').get(0).play();
    });

    $('.message').on('keyup', function(){
      $el = $(this); // This is the textarea
      var message = $el.val();
      var monsterId = $monsterImg.data("id");
      var cardId = $monsterImg.data("card-id");
      $el.closest('.draggable').addClass('writing');

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

      if (message !== "") {
        $el.parent().parent().text(message);
      }
    });

  }); // END OF ADDING A SPEECH BUBBLE

  // EDITING A SPEECH BUBBLE
  $('.bubble-container').dblclick(function(e){
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

    // ADDING TYPING SOUND
    $('.message').on('keydown', function(){
      $('.typing-sound').get(0).play();
    });

    $('.message').on('keyup', function(){
      $el = $(this); // This is the textarea
      var message = $el.val();
      var monsterId = $monsterImg.data("id");
      var cardId = $monsterImg.data("card-id");
      $el.closest('.draggable').addClass('writing');
      var messageEntered = {
        id: cardId,
        monsterId: monsterId,
        message: message
      };

      // console.log("messageEntered: ", messageEntered);
      socket.emit("messageEntered", messageEntered);
    });

    $(".message").blur(function(){
      $el = $(this); // This is the textarea
      var message = $el.val();

      if (message === ""){
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

  // SETTING URL WHEN SHARING MODAL IS OPENED
  $('.share-card').click(function(){
    var url = document.URL;
    $('.url').val(url);
    $('.url').tooltip();
  });


});