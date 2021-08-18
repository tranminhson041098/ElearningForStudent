$(document).ready(function(){
	// scroll fixed nav
	window.onscroll = function() { 
	    (window.pageYOffset > $('body').offset().top ? true : false) ? $('header').addClass('is-scroll') : $('header').removeClass('is-scroll')
	};
	$('.tab-control').on('click', function(){
		var father 	= $(this)
		var tab 	= $(this).attr('tab-toggle')
		father.parent().find('.tab-control').removeClass('is-active')
		father.addClass('is-active')
		father.parent().parent().find('.tab-body').removeClass('is-active')
		father.parent().parent().find(`.tab-body[tab-toggle-id='${tab}']`).addClass('is-active')
	})
	// Open menu
	$('.open-menu').on('click', function(){
		$('body').toggleClass('menu-open');
	})
	// Open sub_navigarion Responsive
	$('.open_sub').on('click', function(){
	    $(this).parent().toggleClass('is-open')
	    $(this).find('i').toggleClass('fa-sort-down')
	    $(this).find('i').toggleClass('fa-sort-up')
	})
	$('.product-course-title').on('click', function(){
	    $(this).parent().toggleClass('is-open')
	    $(this).find('i').toggleClass('fa-caret-down')
	    $(this).find('i').toggleClass('fa-caret-up')
	})

	// Owl config
	$('.owl-carousel').owlCarousel({
	    loop: true,
	    nav: true,
	    autoWidth: false,
	    items: 1,
	    lazyLoad: true,
	    autoplay: true,
	    autoplayTimeout: 5000,
	    autoplayHoverPause: true
	})
});
