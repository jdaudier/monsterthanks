var socket = io.connect();

$(function domReady() {

  $('.action-btn').click(function(e) {
    window.location.href = "/new";
  });

  $.localScroll();


  // $('#open-closet').click(function(){
  //   $('.draggable').each(function(){
  //     var monstersPosition = $(this).position();
      // 23 objects
      // console.log(monstersPosition);
  //   });
  // });

  // $('#open-closet').click(function(){
  //   $('.monster').each(function(){
  //     var width = $(this).width();
  //     var height = $(this).height();
  //     console.log("width: ", width);
  //     console.log("height: ", height);
  //   });
  // });

  // socket.on('connect', function(){
    // socket.emit('monstersPosition', monstersPosition);
  // });

  // Gets position of a monster after dragstop
  $('.draggable').draggable({
    scroll: true,
    containment: 'window',
    start: function( event, ui ) {
      // var $sidr = $(this).parents('.sidr');

      // $sidr.css("overflow-y", "visible");
    },
    stop: function( event, ui ) {
      var location = $(this).position();
      console.log(location);
      // Returns: Object {top: 378.3999938964844, left: 152}
    }
  });

  // Gets size of monster after resizing
  $('.monster').resizable({
    // start: function( event, ui ) {
    //   var $monsterContainer = $(this).parents('.monster-container');
    //   $monsterContainer.css("height", "100");
    // },
    stop: function( event, ui ) {
      var width = $(this).width();
      var height = $(this).height();
      console.log(width);
      console.log(height);
    }
  });







});