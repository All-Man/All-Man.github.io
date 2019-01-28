$(document).ready(function(){

 	"use strict";

 	// Search
 	$('#search .search-trigger').on('click',function(){
        $('.search-bar').animate({height: 'toggle'},500);
    });

    // jQuery to collapse the navbar on scroll
    $(window).scroll(function(){
	    if ($(window).scrollTop() > 10){
	        $('nav').addClass("sticky");
	    }else{
	        $('nav').removeClass("sticky");
	    }
	});


 	$(window).load(function() {

 		// Preloader
		$('#status').fadeOut();
		$('#preloader').delay(350).fadeOut('slow');
	

		// Isotope Filter
		var $container = $('#portfolio-container');
		$container.imagesLoaded( function() {			
			$container.isotope({
				isOriginLeft: true
			});
			$container.isotope();
		});

		// filter items on button click
		$('.portfolio-filter').on( 'click', 'a', function(e) {
			e.preventDefault();
			var filterValue = $(this).attr('data-filter');
			$container.isotope({ filter: filterValue });

			$('.portfolio-filter a').removeClass('active');
			$(this).closest('a').addClass('active');

		});

	});


	// Moblie Menu resize
	$(".navbar-fixed-top .navbar-collapse").css("max-height", $(window).height() - $(".navbar-header").height() );
	    

	// jQuery for page scrolling feature - requires jQuery Easing plugin
	$(function() {
	    $('a.page-scroll').bind('click', function(event) {
	        var $anchor = $(this);
	        $('html, body').stop().animate({
	            scrollTop: $($anchor.attr('href')).offset().top
	        }, 1500, 'easeInOutExpo');
	        event.preventDefault();
	    });
	});


	// Closes the Responsive Menu on Menu Item Click
	$('.navigation.overlay .navbar-collapse ul li a').on('click',function() {
	    $('.navbar-toggle:visible').click();
	});

	
	// Browser Detect
	$.browserSelector();
	// Adds window smooth scroll on chrome.
	if($("html").hasClass("chrome")) {
		$.smoothScroll();
	}
	  
 
 
 	// Wow Animations
 	new WOW().init();

	// Counters

	$('.statistic').appear(function() {
		$('.timer').countTo({
			speed: 4000,
			refreshInterval: 60,
			formatter: function (value, options) {
				return value.toFixed(options.decimals);
			}
		});
	});


	/* ---------------------------------------------------------------------- */
	/*	Contact Form
	/* ---------------------------------------------------------------------- */

	var submitContact = $('#submit-message'),
		message = $('#msg');

	submitContact.on('click', function(e){
		e.preventDefault();

		var $this = $(this);
		
		$.ajax({
			type: "POST",
			url: 'contact.php',
			dataType: 'json',
			cache: false,
			data: $('#contact-form').serialize(),
			success: function(data) {

				if(data.info !== 'error'){
					$this.parents('form').find('input[type=text],input[type=email],textarea,select').filter(':visible').val('');
					message.hide().removeClass('success').removeClass('error').addClass('success').html(data.msg).fadeIn('slow').delay(5000).fadeOut('slow');
				} else {
					message.hide().removeClass('success').removeClass('error').addClass('error').html(data.msg).fadeIn('slow').delay(5000).fadeOut('slow');
				}
			}
		});
	});


});



// Scroll to Top

(function() {
	"use strict";

	var docElem = document.documentElement,
		didScroll = false,
		changeHeaderOn = 550;
		document.querySelector( '#back-to-top' );
	function init() {
		window.addEventListener( 'scroll', function() {
			if( !didScroll ) {
				didScroll = true;
				setTimeout( scrollPage, 50 );
			}
		}, false );
	}
	
})();

$(window).scroll(function(event){
	var scroll = $(window).scrollTop();
if (scroll >= 50) {
    $("#back-to-top").addClass("show");
} else {
    $("#back-to-top").removeClass("show");
}
});

$('a[href="#top"]').on('click',function(){
    $('html, body').animate({scrollTop: 0}, 'slow');
    return false;
});