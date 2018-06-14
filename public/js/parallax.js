$(document).ready(function() {
	/* Scroll event handler */
    $(window).bind('scroll',function(e){

    var scrolled = $(window).scrollTop();
	$('#content').css('left',(0-(scrolled*.9))+'px');
	$('#parallax-bg1').css('left',(0-(scrolled*.25))+'px');
	$('#parallax-bg2').css('left',(0-(scrolled*.5))+'px');
	$('#parallax-bg3').css('left',(0-(scrolled*.82))+'px');
	
    });
});
