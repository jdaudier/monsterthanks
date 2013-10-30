$(function domReady() {

  $('.action-btn').click(function(e) {
    window.location.href = "/new";
  });

  $('#open-menu').sidr();

  $('.draggable').draggable({ scroll: true });

  $( ".draggable" ).on( "dragstop", function( event, ui ) {
    var location = $(this).position();
    console.log(location);
  } );

  // $('.dropzone').droppable({ accept: '.draggable' });

  // $('img').resizable().parent().draggable();

  //  $('.monster').resizable({
  //     aspectRatio: true,
  //     handles: 'ne, se, sw, nw'
  // });












});