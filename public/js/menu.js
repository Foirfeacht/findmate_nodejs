$.noConflict();
var button = document.getElementById('menu-button');
var nav = document.getElementById('menu')
jQuery( document ).ready(function( $ ) {
	$('.content').click(function() {
		$('.menu').hide();
		$('.menu-button').show();
	});

	$('.menu-button').click(function () {
		$('.menu').toggle();
		$('.menu-button').hide();
	});

	$('.menu').click(function (event) {
		event.stopPropagation();
	})

});

