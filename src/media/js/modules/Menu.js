const Callback = require('../classes/Callback');
const dom = require('../utils/DOM');

function Menu() {
	this.$opener = $('.btn-menu');
	this.$wrapper = $('.main-nav');
	this.$staggerElements = this.$wrapper.find('.main-nav__item');
	this.$links = this.$wrapper.find('.main-nav__link');
	this.opened = false;

	this.$opener.on('click', e => {
		e.preventDefault();
		this.toggle();
	});

	dom.$window.on('keydown', e => {
		e.keyCode == 27 && this.opened & this.close();
	});

	this.onOpen = new Callback();
	this.onClose = new Callback();

	dom.$window.on('resize', e => this.close());

	this.$links.on('click', () => {
		this.close();
	});
}
Menu.prototype = {
	open() {
		if (this.opened) {
			return;
		}
		this.opened = true;

		dom.$html.addClass('_menu-opened');

		this.$wrapper.show().nope(false);

		this.onOpen.call();

		TweenMax.staggerFromTo(
			this.$links,
			0.5,
			{ y: '-40%', alpha: 0 },
			{ y: '0%', alpha: 1, delay: 0.5 },
			0.075
		);
	},
	close() {
		if (!this.opened) {
			return;
		}
		this.opened = false;

		dom.$html.removeClass('_menu-opened');

		this.$wrapper.nope();

		this.onClose.call();
	},
	toggle() {
		this.opened ? this.close() : this.open();
	},
};
module.exports = new Menu();
