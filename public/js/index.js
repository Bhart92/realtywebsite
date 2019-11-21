  $(function(){

    //mobileNav toggle
    function navToggle(){
      $(this).toggleClass('is-active');
      $('#mobileNav').toggleClass('active');
      $('body').toggleClass('bodyOverflow');
    }
    $('.hamburger--squeeze').on('click', function(){
      $('.hamburger').toggleClass('is-active');
      $('#mobileNav').toggleClass('active');
      $('body').toggleClass('bodyOverflow');
    });

    //register form
    function showRegisterForm(){
      var formShow = {
        clipPath: 'circle(200% at 100% 0%)',
        zIndex: '1000',
        background: '#fff'
      };
      var showCloseIcon = {
        transform: 'scale(1)'
      };
      var hideLink = {
        opacity: '0',
        zIndex: '-1'
      };
      $('#registerContainer a').css(hideLink);
      $('#signUpFormContainer').css(formShow);
      $('.fa-times').css(showCloseIcon);
      $('#orDiv').css({opacity: '0'});
    }
    function hideRegisterForm(){
      var hideForm = {
        clipPath: 'circle(10% at 100% 0%)',
        zIndex: 'unset',
        background: 'rgba(0, 191, 255, .5)'
      };
      var showLink = {
        opacity: '1',
        zIndex: '1'
      };
      var showCloseIcon = {
        transform: 'scale(0)'
      };
      $('#registerContainer a').css(showLink);
      $('#signUpFormContainer').css(hideForm);
      $('.fa-times').css(showCloseIcon);
      $('#orDiv').css({opacity: '1'});
    }
    $('#registerContainer a').on('click', function(){
      showRegisterForm();
    });
    $('.fa-times').on('click', function(){
      hideRegisterForm();
    });

    // Error/success message fade
    $('.ui.positive.message').delay(2000).fadeOut();
    $('.ui.negative.message').delay(2000).fadeOut();

    // contact modal toggle
    $('.contactLink').on('click', function(){
      $('.modal.contactModal')
        .modal('show')
        ;
      });

      //listing card load animation
    $(".listingCard").each(function(index){
         $(this).css({
              'transition-delay' : .25*(.15+index) + 's',
              'opacity': '1'
         });
     });

  });
