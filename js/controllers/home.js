'use strict';

/**
 * @ngdoc function
 * @name friluftsframjandetApp.controller:controller.home
 * @description
 * # controller.home
 * Controller of the UNAPP
 */
app.obj.angularApp
	.controller('controller.home', function ($scope, $rootScope, $location, $injector, api, utility) {
		var me = {};

		me.init = function () {
			$rootScope.page = 1;
			$rootScope.title = 'Minimum Set of Gender Indicators';
			$scope.visible = false;
			$scope.btnText = 'Read More';
			$rootScope.textToCopy = $location.$$absUrl;
		}

		me.boot = function () {
			me.init();

			me.events();

			me.initCarousel();

			utility.log('Page loaded: ', $scope.page);
		};

		me.events = function () {
			me.initCarousel = function () {
				$(document).ready(function() {
				    var owl_banner = $('#sliding-banner');
				    var owl_text = $('#sliding-text');
				    var carousel_config = {
						items: 1,
						loop: true,
						autoplay:true,
						autoplayTimeout: 8000,
						autoplaySpeed : 1000,
						margin: 0,
						mouseDrag : false,
						touchDrag : false,
						smartSpeed : 1000,
						dots : false
				    };

				    owl_banner.owlCarousel(carousel_config);
				    owl_text.owlCarousel(carousel_config);

				    $('#prevBtn').click(function() {
				      owl_banner.trigger('prev.owl.carousel');
				      owl_text.trigger('prev.owl.carousel');
				    });

				    $('#nextBtn').click(function() {
				      owl_banner.trigger('next.owl.carousel');
				      owl_text.trigger('next.owl.carousel');
				    });
				    me.resize();
				    $( window ).resize(function() {
				    	me.resize();
					});
				})
			}
			me.resize = function () {
			    var sliderHeight = $('#sliding-text').height();
			    var height = (sliderHeight > 90) ? sliderHeight + 40 : 100;
				$('#sliding-text').css('margin-top',-height);
				$('.caption-area').css('height',height);
				$('.nav-area').css('height',height);
				$('.nav-area').css('margin-top',-height);
			}
			$scope.toggle = function () {
				$scope.visible = ($scope.visible) ? false : true;
				$scope.btnText = ($scope.visible) ? 'Read Less' : 'Read More';
			}
			// Clear current scope's function
			$rootScope.clearAllController = function () {
				//
			}
			$rootScope.goTo = function(page) {
				app.obj.app.clearAll();
				api.destroyObjects()
				.then(function(){
					$location.url('/' + page);
				})
			}
		}

		me.boot();
	});
