var socket = io.connect();

$(function domReady() {

  $(".action-btn").click(function(e) {
    window.location.href = "/new";
  });

  $.localScroll();

  $(".draggable").each(function(){
    var monstersPosition = $(this).position();
    var windowWidth = $(window).width();
    // console.log(monstersPosition);
    // console.log(windowWidth);
  });

  // $(".monster").each(function(){
  //   var width = $(this).width();
  //   var height = $(this).height();
  //   console.log("width: ", width);
  //   console.log("height: ", height);
  // });

  // socket.on("connect", function(){
    // socket.emit("monstersPosition", monstersPosition);
  // });

  // Gets position of a monster after dragstop
  $(".draggable").draggable({
    scroll: true,
    containment: "window",
    // start: function( event, ui ) {

    // },
    stop: function( event, ui ) {
      var location = $(this).offset();
      // console.log(location);
      // Returns: Object {top: 378.3999938964844, left: 152}
    }
  });



// var $this = $(this), offset = $this.offset(),
//     width = $this.innerWidth(), height = $this.innerHeight();
// var parentOffset = $(this).offset();
// var relativeXPosition = (e.pageX - parentOffset.left),
//     percentx = relativeXPosition/width;
// var relativeYPosition = (e.pageY - parentOffset.top),
//     percenty = relativeYPosition/height;

  // Gets size of monster after resizing
  $(".monster").resizable({
    stop: function( event, ui ) {
      var width = $(this).width();
      var height = $(this).height();
      // console.log(width);
      // console.log(height);
    }
  });

  // $(".background").droppable({
  //   drop: function() {
  //   }
  // });

  $(".draggable").dblclick(function(e) {
    // e.target = monster img
    // if ($(e.target).hasClass("bubble")===true) {
    //   alert("hi")
    // }

    if ($(e.target).hasClass("monster")===false || $(this).hasClass("has-bubble")===true) {
      return false;
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
        var location = $(this).offset();
        // console.log(location);
        // Returns: Object {top: 378.3999938964844, left: 152}
      }
    });
    $(document).on("blur", ".message", function() {
      $el = $(this);
      var message = $el.val();
      $el.parent().text(message);
    });
  });

  // $('.message').on('keyup', function(e) {
  //   $el = $(this);
  //   if(e.which === 13) {
  //     socket.emit('message', $el.val());
  //   }
  // });














});