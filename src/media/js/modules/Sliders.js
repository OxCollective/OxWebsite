function Sliders() {
	$('[data-slick]').slick({
		prevArrow:
			"<button class='slick-arrow slick-prev' type='button'><svg class='slick-arrow-icon'><use xlink:href='#icon-chevron_left'/></svg></button>",
		nextArrow:
			"<button class='slick-arrow slick-next' type='button'><svg class='slick-arrow-icon'><use xlink:href='#icon-chevron_right'/></svg></button>",
		responsive: [
			{
				breakpoint: 768,
				settings: {
					dots: true,
				},
			},
		],
	});
}

module.exports = new Sliders();
