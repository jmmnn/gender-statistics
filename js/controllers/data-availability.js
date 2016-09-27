'use strict';

/**
 * @ngdoc function
 * @name friluftsframjandetApp.controller:controller.data-availability-dashboard
 * @description
 * # controller.data-availability-dashboard
 * Controller of the UNapp
 */
app.obj.angularApp
	.controller('controller.data-availability', function ($scope, $rootScope, $location, $injector, api, utility) {
		$scope.loaded = false;

		var me = {
			width: $('.container').width(),
			height: $('.container').height(),
			top:  $('#header').height()
		};

		me.init = function () {
			$('#preloader').width(me.width);
			$('#preloader').height(me.height-me.top);
			$rootScope.page = 4;
			$rootScope.title = 'Data Availability Dashboard';
			me.objects = ['ydcMa','mSWf','Caeq','QRpQBXb', 'KAaYuk', 'RyaHUc']; // KAaYuk UPjefA
			me.noInteraction = [false,false,true,false,false,false];
			$scope.priceSlider = 150;
			$scope.selection = {
				CtryName: 'Belgium'
			};
			$scope.selectionDisplay = {
				CtryName: 'Select Country'
			};
			$rootScope.textToCopy = $location.$$absUrl;
		}

		me.boot = function () {
			me.init();

			me.events();

			// app.obj.app.getObject('CurrentSelections', 'CurrentSelections');
			api.destroyObjects()
			.then(function(){
				me.getCtryName();
				api.getObjects(me.objects, me.noInteraction).then(function(){
					$scope.loaded = true;
				})
			})

			utility.log('Page loaded: ', $scope.page);
		};

		me.events = function () {
			$scope.clearAll = function () {
				app.obj.app.clearAll();
			}
			me.getCtryName = function () {
				api.getFieldDataQ('CtryName').then(function (data) {
					$scope.CtryName = _.filter(data, function(obj){ return (obj[0].qState==='X')?false:true; });
					// $scope.selectCtryName($scope.selection.CtryName);
				});
			}
			$scope.selectCtryName = function (value) {
				app.obj.app.clearAll();
				$scope.selection['CtryName'] = value;
				$scope.selectionDisplay['CtryName'] = utility.truncateText(value);
				app.obj.app.field('CtryName').selectValues([value], false, false);
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
