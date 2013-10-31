var socket = io.connect();

$(function domReady() {

  socket.on('connect', function(){
    // Gets position of all monsters after opening the closet
    $('#open-closet').click(function(){
      $('.draggable').each(function(){
        var monstersPosition = $(this).position();
      });
      socket.emit('monstersPosition', monstersPosition);
        console.log(monstersPosition);
    });

  });


  $('.action-btn').click(function(e) {
    window.location.href = "/new";
  });

  $('#open-closet').sidr();

  // Gets position of a monster after dragstop
  $('.draggable').draggable({
    scroll: true,
    stop: function( event, ui ) {
      var location = $(this).position();
      console.log(location);
      // Returns: Object {top: 378.3999938964844, left: 152}
    }
  });

  // Gets size of monster
  $('.monster').resizable({
    stop: function( event, ui ) {
      var width = $(this).width();
      var height = $(this).height();
      console.log(width);
      console.log(height);
    }
  });


  // $('.dropzone').droppable({ accept: '.draggable' });







});