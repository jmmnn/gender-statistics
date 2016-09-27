';use strict';

/**
 * @ngdoc function
 * @name myApp.directive: getObject
 * @description
 * # getObject
 * Controller of the myApp
 */
app.obj.angularApp
	.directive('preloader', function($parse, $sce, $compile) {
		var me = {
			def: {
				restrict: 'AE',
        		transclude: false,
        		replace: true
			}
		};

		me.boot = function () {
			me.def.scope = {
				data: '='
			};

			me.def.link = function (scope, element, attrs) {
				console.log(scope);
				var html = 'Loading...';
				element.html(html);
			};

			return me.def;
		};

		return me.boot();
	});