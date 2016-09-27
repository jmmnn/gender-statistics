'use strict';

/**
 * @ngdoc function
 * @name friluftsframjandetApp.controller:controller.dashboard
 * @description
 * # controller.dashboard
 * Controller of the friluftsframjandetApp
 */
app.obj.angularApp
	.controller('controller.downloads', function ($scope, $rootScope, $location, $injector, api, utility) {
		$scope.loaded = false;

		var me = {
			width: $('.container').width(),
			height: $('.container').height(),
			top:  $('#header').height()
		};

		me.init = function () {
			$('#preloader').width(me.width);
			$('#preloader').height(me.height-me.top);
			$rootScope.page = 5;
			$rootScope.title = 'Data Table';
			// me.dimensions=['IndicatorSubNum', "SeriesName", 'DomainName', 'Tier', 'AgencyLong', "=if(len(EdgeName)>0,1,0)"];
			me.dimensions=['OrderNum','IndicatorSubNum', "SeriesName", 'DomainName', 'Tier', 'AgencyLong', "=if(len(EdgeName)>0,1,0)"];
			me.measures=[];
			me.export = [
				{ // data
					headers:["Indicator Name", 'Region', 'Country Code', 'Country', 'Year', 'Sex','Value', 'LowerBound', 'UpperBound', 'NatureDataID', 'OriginDataID', 'Footnote1', 'Footnote2', 'Footnote3', 'Footnote4', 'Footnote5', 'Footnote6', 'Coverage'], 
					data:[["SeriesName", 'MDGRegionName', 'CtryCode', 'CtryName', 'YearStart', 'Sex','DataValue', 'LowerBound', 'UpperBound', 'NatureDataID', 'OriginDataID', 'Footnote1', 'Footnote2', 'Footnote3', 'Footnote4', 'Footnote5', 'Footnote6', 'Coverage'], []]
				},
				{ // Metadata
					headers:['IndicatorSubNum', "Indicator Name", 'Tier', 'MetaCatID', 'MetaCatName', 'MetaText', 'MetaSource'], 
					data:[['IndicatorSubNum', "SeriesName", 'Tier', 'MetaCatID', 'MetaCatName', 'MetaText', 'MetaSource'], []]
				},
				{ // Data for 42a and 42b
					headers:["Indicator Name", 'CoDCode', 'CoDName', 'Region', 'Country Code', 'Country', 'Year', 'Sex', 'LowerBound', 'Value', 'LowerBound', 'UpperBound', 'NatureDataID', 'OriginDataID', 'Footnote1', 'Footnote2', 'Footnote3', 'Footnote4', 'Footnote5', 'Footnote6', 'Coverage'], 
					data:[["SeriesName", 'CoDCode', 'CoDName', 'MDGRegionName', 'CtryCode', 'CtryName', 'YearStart', 'Sex','DataValue', 'LowerBound', 'UpperBound', 'NatureDataID', 'OriginDataID', 'Footnote1', 'Footnote2', 'Footnote3', 'Footnote4', 'Footnote5', 'Footnote6', 'Coverage'], []]
				},
			];
			//$rootScope.textToCopy = $location.$$absUrl;
            $rootScope.textToCopy = $location.$$absUrl;
			// app.obj.app.getObject('CurrentSelections', 'CurrentSelections');
		}

		me.boot = function () {
			me.init();

			me.events();

			app.obj.app.clearAll();
			me.getIndicator();

			utility.log('Page loaded: ', $scope.page);
		};

		me.events = function () {
			me.getIndicator = function () {
				api.getHyperCubeQ(me.dimensions,me.measures, null, 'OrderNum').then(function(data){
					$scope.dataTable = data;
					$scope.loaded = true;
				})
			}
            
            $scope.export = function (series, index, id) { // 0: data, 1: Metadata, 3:data for 42a and 42b
				app.obj.app.field('SeriesName').selectValues([series], false, false).then(function(){
					api.getAllresults(me.export[index].data[0], me.export[index].data[1]).then(function(data){
						console.log(data)
					// api.getHyperCubeQ(me.export[index].data[0], me.export[index].data[1]).then(function(data){
						series = series.replace(/,/g , " ");
						var	title = id + ' - ' + series;
						var csvString = title + "\n\n";
						if (index == 0 || index == 2) {
							title += '_data';
							for(var i=0; i<me.export[index].headers.length;i++){
								csvString = csvString + me.export[index].headers[i] + ((i==(me.export[index].headers.length-1))?"\n":",");
							}
							for(var i=0; i<data.length;i++){
								var rowData = data[i];
								for(var j=0; j<rowData.length;j++){
                                    if (rowData[j].qText == null){
                                        rowData[j].qText='-'
                                    }else{
									   rowData[j].qText = rowData[j].qText.replace(/,/g , " ");}
									csvString = csvString + rowData[j].qText + ((j==(rowData.length-1))?"\n":",");
								}
							}
						}
						if (index == 1) {
							csvString = title + "\n\n";
							title += '_metadata';
							csvString += 'ID, Metadata Category, Metadata Description, Source\n'
							for(var i=0; i<data.length;i++){
								var rowData = data[i];
								csvString += rowData[3].qText + ',' + rowData[4].qText.replace(/,|\n/g , "") + ',' + rowData[5].qText.replace(/,|\n/g , "") + ',' + rowData[6].qText + "\n";
							}
						}
						// var csvData = 'data:application/octet-stream;base64,' + btoa(unescape(encodeURIComponent(csvString)));
						var csvData = new Blob([csvString], { type: 'text/csv' }); //new way
						var csvUrl = URL.createObjectURL(csvData);

						var a = $('<a/>', {
							style: 'display:none',
							href: csvUrl,
							download: title + '.csv'
						}).appendTo('body')
						a[0].click()
						a.remove();
						app.obj.app.clearAll();
					});
				})
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
