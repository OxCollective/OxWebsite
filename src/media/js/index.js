import { TweenMax } from 'gsap';
global.TweenMax = TweenMax;
global.$ = global.jQuery = require('jquery');
require('./utils/jqExtensions');
require('slick-carousel');
require('gsap/ScrollToPlugin');

global.OX && window.location.reload();

// prettier-ignore
global.OX = new function OX() { // eslint-disable-line
	this.env = require('./utils/ENV');
	this.dom = require('./utils/DOM');
	this.utils = require('./utils/Utils');

	this.classes = {
		Callback: require('./classes/Callback')
	};

	this.helpers = {
		ShowHelper2: require('./helpers/ShowHelper2'),
		ScrollHelper: require('./helpers/ScrollHelper'),
	};

	this.modules = {
		Sliders: require('./modules/Sliders'),
		Menu: require('./modules/Menu'),
	};

	const ShowHelper2 = this.helpers.ShowHelper2;
	const self = this;

	// Startup
	$(() => {
		// Remove _loading modificator
		this.dom.$html.removeClass('_loading');
		// Apply page effects
		(function(){

			ShowHelper2.setViewpostScale(1);

			const $targets = $('[data-animation]');

			function animate(target){
				let attrValue = target.getAttribute('data-animation')

				if(attrValue == ''){
					return console.warn('Empty data-animation attribute value')
				}

				let settings = $.trim(attrValue).split(',')
				let cssClass = $.trim(settings[0])

				if(cssClass && cssClass.length){

					target.classList.add('_zero-ease')
					target.classList.remove(cssClass)

					let delay = parseFloat(settings[1])
					let multipleFlag = $.trim(settings[2])

					TweenMax.delayedCall((isNaN(delay) ? 0 : delay) + 0.01, () => {

						target.classList.remove('_zero-ease')
						target.classList.add(cssClass)
					})

					if(!multipleFlag){
						ShowHelper2.unwatch(target);
						target.removeAttribute('data-animation');
					}
				}
			}
			ShowHelper2.staggerWatch(
				$targets,
				function(state, target) {
					if (state) {
						animate(target)
					}
				},
				true,
				false,
				55
			);

			ShowHelper2.start();
		})();

		// Anchors
		(function(){
			let $anchors = $('[data-section-anchor]');
			$anchors.on('click', e => {
				let name = $(e.currentTarget).attr('data-section-anchor')
				self.helpers.ScrollHelper.scrollTo( $('[data-section="' + name + '"]') )
			})

			let $sections = $('[data-section]');
			let totalSections = $sections.length;
			let sectionsY = [];
			let currentSectionIndex = -1;
			let scrolledAdded;

			function updatePositions(){
				for(let k=0; k<totalSections; k++){
					sectionsY[k] = $sections.eq(k).offset().top;
				}
			}
			updatePositions()

			function applySectionIndex(index){
				if( index != currentSectionIndex){
					currentSectionIndex = index;
					let name = $sections.eq(index).attr('data-section');
					$anchors.removeClass('_selected').filter('[data-section-anchor="' + name + '"]').addClass('_selected')
				}
			}

			function updateSectionIndex(){
				let viewY = window.pageYOffset + window.innerHeight / 2;

				let nearestDistance = Number.POSITIVE_INFINITY;
				let nearestIndex = -1;

				for(let k=0; k<totalSections; k++){
					if(k == totalSections - 1){
						applySectionIndex(k)
					} else if(sectionsY[k + 1] > viewY){
						applySectionIndex(k)
						break
					}
				}

				let needAddScrolled = window.pageYOffset > 0;	
				if(scrolledAdded != needAddScrolled){
					scrolledAdded = needAddScrolled

					scrolledAdded ? self.dom.$html.addClass('_scrolled') : self.dom.$html.removeClass('_scrolled')
				}
			}



			self.dom.$window.on('scroll', e => updateSectionIndex()).on('resize', e => {
				updatePositions()
			})

			updateSectionIndex()
		})();

		//header bg toggle
		(function(){
			let $header = $(document).find('.main-header');
			let headerBackgroudShowed = false;
			window.addEventListener('scroll', e => {
				let newState = window.pageYOffset > 100;
				if( newState != headerBackgroudShowed ){
					headerBackgroudShowed  = newState;
					headerBackgroudShowed ? $header.addClass('_with-bg') : $header.removeClass('_with-bg')
				}
			})
		})()
	});
}();

if (module.hot) {
	module.hot.accept();
}
