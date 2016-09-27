'use strict';

/**
 * @ngdoc function
 * @name friluftsframjandetApp.controller:controller.indicator-dashboard
 * @description
 * # controller.indicator-dashboard
 * Controller of the UNAPP
 */
app.obj.angularApp
	.controller('controller.indicators', function ($scope, $rootScope, $location, $injector, api, utility) {
		$scope.loaded = false;

		var me = {
			width: $('.container').width(),
			height: $('.container').height(),
			top:  $('#header').height()
		};

		me.init = function () {
			$('#preloader').width(me.width);
			$('#preloader').height(me.height-me.top);
			$rootScope.page = 2;
			$rootScope.title = 'Indicator Dashboard';		
			$scope.SeriesName = [];
			$scope.DomainName = [];
            $scope.Tier = [1,2,3];
			
			me.objects = ['WkuvcF','Esfdk'];
			$scope.selection = {
				SeriesName: null,
				DomainName: null,
				MDGRegionName: null,
				CoDName: null,
				Tier: 'Select Tier',
			};
			$scope.selectionDisplay = {
				SeriesName: 'Select Indicator',
				MDGRegionName: 'Select Region',
				CoDName: 'Select Cause of Death'
			}
			$scope.codVisible = true;
			me.dropdownCharacterLength = 20;
			$rootScope.textToCopy = $location.$$absUrl;
		}

		me.boot = function () {
			me.init();
			me.events();
			// app.obj.app.getObject('CurrentSelections', 'CurrentSelections');
			api.destroyObjects()
			.then(function(){
				// api.getObjects(me.objects)
				// .then(function(){
					$scope.clearAll();
				// });
			})
			utility.log('Page loaded: ', $scope.page);
		};

		me.events = function () {
			$scope.clearAll = function () {
				app.obj.app.clearAll();
				$scope.selection.SeriesName = 'Labour force participation rate for persons aged 15-24, by sex';
				$scope.selection.DomainName = 0;
				$scope.selection.MDGRegionName = null;
				$scope.selectionDisplay.MDGRegionName = 'Select Region';
				$scope.selection.Tier = 1;
				$scope.selectDomain(0);
			}
			$scope.selectDomain = function (value) {
                app.obj.app.field('Tier').clear(); // Clear tier selection before select domainname, or else it will only list the tier belonging to previous domainname selected
				$scope.selection['DomainName'] = value;
				app.obj.app.field('DomainName').select([value], false, false)
				.then(function(){
					me.getTier();
				});
			}
            
            // Tier filter
			me.getTier = function () {
				api.getFieldDataQ('Tier').then(function (data) {
                    //console.log(data);
                    $scope.Tier = _.filter(data, function(obj){
                        return (obj[0].qState!=='X' && obj[0].qState!=='L')?true:false;
                    });
					$scope.selectTier($scope.Tier[0][0].qNum);
				});
			}
			$scope.selectTier = function (value) {
				$scope.selection['Tier'] = value;
				app.obj.app.field('Tier').selectValues([value], false, false)
				.then(function(){
					me.getIndicator();
				})
			}
            
            // Indicator filter
			me.getIndicator = function () {
				api.getHyperCubeQ(['IndicatorID','SeriesName'],[]).then(function(data3){
					$scope.SeriesName = _.filter(data3, function(obj3){
						return (obj3[1].qState!=='X' && obj3[1].qState!=='L')?true:false;
					});
					if (!$scope.SeriesName.length) {
						$scope.selectionDisplay.SeriesName = "No Data";
						$scope.selection.SeriesName = null;
					} else {
                        $scope.selectIndicator($scope.SeriesName[0][0].qNum, $scope.SeriesName[0][1].qText);
					}
				})
			}
            
			$scope.selectIndicator = function (id, value) {
				// Set the expression for the indicator variable and then select it
                // id is equal to IndicatorId in original data
				var expression = '';
				if (id==1||id==2) {
					expression = "Num(AVG({$<IsMaxSource={'Y'},Sex={'Male','Female','not applicable'},IsMaxYear={'Y'},YearStart={\">=$(vMinYear)\"}>}DataValue), '#,### Hours')"
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
                app.obj.app.variable.setStringValue('vIndicatorVariable', expression)
                $scope.selection['SeriesName'] = value;
				var SeriesNameSeriesName = id + '-' + value;
                $scope.selectionDisplay.SeriesName = utility.truncateText(SeriesNameSeriesName,me.dropdownCharacterLength);
				app.obj.app.field('SeriesName').selectValues([value], false, false).then(function(){
					me.getMDGRegionName();
				})
                    .then(function(){
					me.getCOD();
				})
                ;
				// If Indicator is 42 show the 'Case of death'
                if (id==42) {
					$scope.codVisible = true;
				} else {
					$scope.codVisible = false;
				};
			};
            
            // COD filter
            me.getCOD = function() {
				api.getFieldDataQ('CoDName').then(function (data2) {
                    //console.log(data2);
					$scope.CoDName = _.filter(data2, function(obj){ 
                        return (obj[0].qState==='O')?true:false; });
                        console.log('COD options: ' )
                        console.log($scope.CoDName)
                        if (!$scope.loaded) {
                            api.getObjects(me.objects)
                            .then(function(){
                                $scope.loaded = true;
                            })
                        }
				});
			};
            
            $scope.selectCOD = function (value) {
                console.log(value);
				$scope.selection['CoDName'] = value;
				$scope.selectionDisplay.CoDName = utility.truncateText(value,me.dropdownCharacterLength);
				app.obj.app.field('CoDName').selectValues([value], false, false);
			};
            
            // Region filter
			me.getMDGRegionName = function() {
				api.getFieldDataQ('MDGRegionName').then(function (data) {
					$scope.MDGRegionName = _.filter(data, function(obj){ return (obj[0].qState==='X')?false:true; });
					if (!$scope.loaded) {
						api.getObjects(me.objects)
						.then(function(){
							$scope.loaded = true;
						})
					}
				});
			};
        
			$scope.selectRegion = function (value) {
				$scope.selection['MDGRegionName'] = value;
				$scope.selectionDisplay.MDGRegionName = utility.truncateText(value,me.dropdownCharacterLength);
				app.obj.app.field('MDGRegionName').selectValues([value], false, false);
			};

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
