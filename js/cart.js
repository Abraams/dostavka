
	const openCartElems = $("[data-action='openCart']");
	const closeCartElems = $("[data-action='closeCart']");
	const body = $('body');


const openCart = function() {
	// открываем корзину
	$('.cart').removeClass('_hidden');
	noScroll();
}
const closeCart = function() {
	// Закрываем корзину
	$('.cart').addClass('_hidden');
	noScroll();
}

function noScroll() {
	body.toggleClass('_no-scroll');
}





$(document).ready(function() {
	openCartElems.click(openCart);
	closeCartElems.click(closeCart);


})
