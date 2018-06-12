$(document).ready(function() {
	
	// redrawDotNav();
	
	/* Scroll event handler */
    $(window).bind('scroll',function(e){
    	parallaxScroll();
		// redrawDotNav();
    });
    
    
});

/* Scroll the background layers */
function parallaxScroll(){
	var scrolled = $(window).scrollTop();
	$('#content').css('left',(0-(scrolled*.9))+'px');
	$('#parallax-bg1').css('left',(0-(scrolled*.25))+'px');
	$('#parallax-bg2').css('left',(0-(scrolled*.5))+'px');
	$('#parallax-bg3').css('left',(0-(scrolled*.82))+'px');
}

// /* Set navigation dots to an active state as the user scrolls */
// function redrawDotNav(){
// 	// var section1Top =  0;
// 	// // The top of each section is offset by half the distance to the previous section.
// 	// var section2Top =  $('#frameless-parachute').offset().left + 1000;
// 	// var section3Top =  $('#english-channel').offset().left +3000;
// 	// var section4Top =  $('#about').offset().left +4000;
// 	// $('nav#primary a').removeClass('active');
// 	// if($(document).scrollTop() >= section1Top && $(document).scrollTop() < section2Top){
// 	// 	$('nav#primary a.manned-flight').addClass('active');
// 	// } else if ($(document).scrollTop() >= section2Top && $(document).scrollTop() < section3Top){
// 	// 	$('nav#primary a.frameless-parachute').addClass('active');
// 	// } else if ($(document).scrollTop() >= section3Top && $(document).scrollTop() < section4Top){
// 	// 	$('nav#primary a.english-channel').addClass('active');
// 	// } else if ($(document).scrollTop() >= section4Top){
// 	// 	$('nav#primary a.about').addClass('active');
// 	// }
	
// }
