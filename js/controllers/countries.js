'use strict';

/**
 * @ngdoc function
 * @name friluftsframjandetApp.controller:controller.country-dashboard
 * @description
 * # controller.country-dashboard
 * Controller of the UNAPP
 */
app.obj.angularApp
	.controller('controller.countries', function ($scope, $rootScope, $location, $q, $injector, api, utility) {
		$scope.loaded = false;
		
		var me = {
			width: $('.container').width(),
			height: $('.container').height(),
			top:  $('#header').height()
		};

		me.init = function () {
			$('#preloader').width(me.width);
			$('#preloader').height(me.height-me.top);
			$rootScope.page = 3;
			$rootScope.title = 'Country Dashboard';
			me.objects = ['dXMRZ','QNwj','WQBSSxA','uyZnpjH','suLjJn','UVmDygb','WjzupK'];
			$scope.SeriesName = [];
			$scope.CtryName = [];
			$scope.selection = {
				SeriesName: 'Adjusted net enrolment rate in primary education by sex',
				CtryName: 'Belgium'
			};
			$scope.selectionDisplay = {
				SeriesName: 'Select Indicator',
				CtryName: 'Select Country'
			};
			me.dropdownCharacterLength = 22;
			$rootScope.textToCopy = $location.$$absUrl;
			$scope.codVisible = false;
		}

		me.boot = function () {
			me.init();

			me.events();
			
			// app.obj.app.getObject('CurrentSelections', 'CurrentSelections');

			app.obj.app.clearAll();
			api.destroyObjects()
			.then(function(){
// 				api.getObjects(me.objects)
// 				.then(function(){
					me.getCtryName();
				// });
			})

			utility.log('Page loaded: ', $scope.page);
		};

		me.events = function () {
			$scope.clearAll = function () {
				$scope.selection.CtryName = 'Belgium';
				$scope.selection.SeriesName = 'Adjusted net enrolment rate in primary education by sex';
				me.getCtryName();
			}
			me.getCtryName = function () {
				api.getFieldDataQ('CtryName').then(function (data) {
					$scope.CtryName = _.filter(data, function(obj){ return (obj[0].qState==='X')?false:true; });
					$scope.selectCtryName($scope.selection.CtryName);
				});
			}
			$scope.selectCtryName = function (value) {
				app.obj.app.clearAll();
				$scope.selection['CtryName'] = value;
				$scope.selectionDisplay['CtryName'] = utility.truncateText(value);
				app.obj.app.field('CtryName').selectValues([value], false, false)
				.then(function(){
					me.getIndicators();
				});
			}
			me.getIndicators = function () {
				var deferred = $q.defer();
				api.getHyperCubeQ(['SeriesName','IndicatorID'],[]).then(function(data3){
					$scope.SeriesName = _.filter(data3, function(obj3){
						return (obj3[0].qState!=='X' && obj3[0].qState!=='L')?true:false;
					});
					if (!$scope.SeriesName.length) {
						$scope.selectionDisplay.SeriesName = "No Data";
						$scope.selection.SeriesName = null;
					} else {
						$scope.selectIndicator($scope.SeriesName[0][1].qElemNumber, $scope.SeriesName[0][0].qText);
					}
					deferred.resolve(true);
				});
				return deferred.promise;
			}
			
			$scope.selectIndicator = function (id, value) {
				var deferred = $q.defer();
				var expression = '';
				if (id==1||id==2) {
					expression = "Num(AVG(distinct {$<Sex={'Male','Female','not applicable'},IsMaxSource={'Y'},YearStart={'>=$(vMinYear2)'},Tier=,AgencyLong=,EdgeName=>}DataValue), '#,### Hours')";
				} else if ((id >= 3 && id <=23) || (id >=25 && id <= 32) || (id >=35 && id <= 40) || (id >=43 && id < 52)) {
					expression = "Num(AVG({$<IsMaxSource={'Y'},Sex={'Male','Female','not applicable'},IsMaxYear={'Y'},YearStart={\">=$(vMinYear)\"}>}DataValue)/100, '#,###.#%')";
				} else if (id == 24) {
					expression = "Num(AVG({$<IsMaxSource={'Y'},Sex={'Male','Female','not applicable'},IsMaxYear={'Y'},YearStart={\">=$(vMinYear)\"}>}DataValue), '#,###.## Gender parity index')";
				} else if (id == 33) {
					expression = "Num(AVG({$<IsMaxSource={'Y'},Sex={'Male','Female','not applicable'},IsMaxYear={'Y'},YearStart={\">=$(vMinYear)\"}>}DataValue), '#,###.## Deaths per 1,000 live births')";
				} else if (id == 34) {
					expression = "Num(AVG({$<IsMaxSource={'Y'},Sex={'Male','Female','not applicable'},IsMaxYear={'Y'},YearStart={\">=$(vMinYear)\"}>}DataValue), '#,### Maternal deaths per 100,000 live births')";
				} else if (id == 41) {
					expression = "Num(AVG({$<IsMaxSource={'Y'},Sex={'Male','Female','not applicable'},IsMaxYear={'Y'},YearStart={\">=$(vMinYear)\"}>}DataValue), '#,###.# Years')";
				} else if (id == 52) {
					expression = "Num(AVG({$<IsMaxSource={'Y'},Sex={'Male','Female','not applicable'},IsMaxYear={'Y'},YearStart={\">=$(vMinYear)\"}>}DataValue), '#,###.## Births per 1000 women aged 15-19')";
				} else if (id >= 42) {
					expression = "Num(AVG({$<IsMaxSource={'Y'},Sex={'Male','Female','not applicable'},IsMaxYear={'Y'},YearStart={\">=$(vMinYear)\"}>}DataValue), '#,###.## Deaths per 100,000')";
				};
				app.obj.app.variable.setStringValue('vIndicatorVariableCountry', expression)
				$scope.selection['SeriesName'] = value;
				$scope.selectionDisplay['SeriesName'] = utility.truncateText(value);
				app.obj.app.field('SeriesName').selectValues([value], false, false).then(function(){
					if (!$scope.loaded) {
						api.getObjects(me.objects).then(function(){
							$scope.loaded = true;
							deferred.resolve(true);
						})
					}
				});
				// Show Cause of Death if indicator 42 selected
				if (id==42) {
					$scope.codVisible = true;
					api.getHyperCubeQ(['CoDCode','CoDName'],[]).then(function(data){
						$scope.COD = _.filter(data, function(obj){
							return (obj[1].qState!=='X' && obj[1].qState!=='L')?true:false;
						});
						$scope.selectCOD($scope.COD[18][1]);
					});
				} else {
					$scope.codVisible = false;
				}
				return deferred.promise;
			}
			$scope.selectCOD = function (item) {
				$scope.selection['COD'] = item.qText;
				$scope.selectionDisplay.COD = utility.truncateText(item.qText, me.dropdownCharacterLength);
				app.obj.app.field('CoDName').select([item.qElemNumber], false, false);
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
