const dom = require('../utils/DOM');

function TopParallax() {
	const $targets = $('[data-top-parallax]');
	dom.$window.on('scroll touchmove', e => {
		TweenMax.set($targets, { force3D: true, y: window.pageYOffset / 1.5 });
	});
}

module.exports = new TopParallax();
