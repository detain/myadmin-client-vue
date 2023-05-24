import $ from 'jquery';
import jQuery from 'jquery';

$(document).ready(function() {
	$('.navbar a.dropdown-toggle').on('click', function(e) {
		var $el = $(this);
		var $parent = $(this).offsetParent(".dropdown-menu");
		$(this).parent("li").toggleClass('open');
		if(!$parent.parent().hasClass('nav'))
			$el.next().css({"top": $el[0].offsetTop, "left": 10});
		$('.nav li.open').not($(this).parents("li")).removeClass("open");
		return false;
	});
	jQuery('ul.nav li.dropdown').hover(function() {
		if(!jQuery(this).parent().hasClass('nav'))
			jQuery(this).children('.dropdown-menu').css({"top": jQuery(this).children('.dropdown-toggle').offsetTop - 15, "left": 10});
		//jQuery(this).addClass('open').parents('li.dropdown').addClass('open');
		jQuery(this).children('.dropdown-menu').stop(true, true).delay(200).fadeIn();
	}, function() {
		//jQuery(this).removeClass('open').parents('li.dropdown').removeClass('open');
		jQuery(this).children('.dropdown-menu').stop(true, true).delay(200).fadeOut();
	});
});
