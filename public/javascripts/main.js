$(function domReady() {

  $('.action-btn').click(function(e) {
    window.location.href = "/new";
  });

  $('#open-menu').sidr();

  // Gets position of monster
  $('.draggable').draggable({
    scroll: true,
    stop: function( event, ui ) {
      var location = $(this).position();
      console.log(location);
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