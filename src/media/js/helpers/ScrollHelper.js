const dom = require('../utils/DOM');
const Menu = require('../modules/Menu');
//const Popups = require('../modules/Popups');

function ScrollHelper() {
	this.$scrollTarget = dom.$window;
	this.$lockTarget = dom.$body;

	this.$widthLockTarget = dom.$body;

	this._scrollHandlers = [];

	this.locked = false;
	let self = this;

	dom.$window.keydown(function(e) {
		if (!self.locked) {
			return;
		}
		let keyCode = e.keyCode || e.which;
		if (keyCode == 9) {
			let $target = $(e.target);
			if ($target.is(self.$scrollTarget)) {
				e.preventDefault();
			} else if (self.$scrollTarget.has($target).length > 0) {
				e.preventDefault();
			}
		}
	});

	$('[data-scroll-to]').mousedown(function(e) {
		e.preventDefault();
		let scrollTo = $(this).attr('data-scroll-to');

		self.scrollTo(isNaN(parseInt(scrollTo)) ? scrollTo : parseInt(scrollTo));
	});
}

ScrollHelper.prototype = {
	scrollTo: function(value, time, completeHandler, skipOnScrolling) {
		if (this._busy) {
			if (skipOnScrolling) {
				return;
			}
		}
		if (isNaN(Number(value))) {
			let $target = $(value).first();
			if (!$target.length) {
				return;
			}
			value = $target.offset().top;
		}

		value = value < 0 ? 0 : value;

		let maxScroll = dom.$document.height() - dom.$window.height();
		value = value > maxScroll ? maxScroll : value;

		if (typeof time != 'number') {
			let current = this.$scrollTarget.scrollTop();
			let distance = Math.abs(current - value);
			time = distance / 1000;
			time = time < 0.25 ? 0.25 : time;
			time = time > 1.3 ? 1.3 : time;
		}
		if (Math.abs(this.$scrollTarget.scrollTop() - value) <= 20) {
			time = 0.1;
		}

		this._busy = true;

		let self = this;
		TweenMax.to(this.$scrollTarget, time, {
			scrollTo: { y: value - 100, autoKill: false },
			ease: time < 0.75 ? Power3.easeOut : Circ.easeInOut,
			onComplete: function() {
				self._busy = false;
				if (typeof completeHandler == 'function') {
					completeHandler();
				}
			},
		});

		//Popups.close();
	},
};

module.exports = new ScrollHelper();
