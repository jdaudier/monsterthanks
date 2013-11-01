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
      console.log(location);
      // Returns: Object {top: 378.3999938964844, left: 152}
    }
  });

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

  $(".draggable").dblclick(function() {
    var source = $("#speech-bubble").html();
    var bubbleTemplate = Handlebars.compile (source);
    var messageObj = {
      message: "This is a thank you message"
    };
    bubbleTemplate = bubbleTemplate(messageObj);
    $(bubbleTemplate).prependTo($(this));
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
  });














});