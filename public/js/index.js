$('.contactLink').on('click', function(){
  $('.modal.contactModal')
    .modal('show')
    ;
  });



  $(function(){
    $(".listingCard").each(function(index){
         $(this).css({
              'transition-delay' : .25*(.15+index) + 's',
              'opacity': '1'
         });
     });
     //Error/success message fade
     // $('.ui.positive.message').delay(2000).fadeOut();
     // $('.ui.negative.message').delay(2000).fadeOut();
     //
  })
