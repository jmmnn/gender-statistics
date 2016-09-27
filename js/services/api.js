'use strict';

/**
 * @ngdoc function
 * @name friluftsframjandetApp.controller: api
 * @description
 * # api
 * Controller of the friluftsframjandetApp
 */
app.obj.angularApp
.service('api', function ($q, $rootScope, utility) {
	var me = this;
		
	me.getObjects = function (obj, nointeractions) {
		var deferred = $q.defer(),
			promises = [];
		
		setTimeout(function(){ 
			angular.forEach(obj, function(value, key) {
				var nointeraction = (nointeractions && nointeractions[key]) ? {noInteraction:true} : {noInteraction:false};
				app.obj.app.getObject('obj_'+value, value, nointeraction).then(function(model){
					app.obj.model.push(model);
					deferred.resolve(value);
				});
				promises.push(deferred.promise);
			});
		}, 500);
		return $q.all(promises).then(function(){
			app.obj.qlik.resize();
		});
	};

	me.destroyObjects = function () {
		var deferred = $q.defer();
		var promises = [];
		if (app.obj.model.length >= 1) {
			angular.forEach(app.obj.model, function(value, key) {
				value.close();
				deferred.resolve();
				promises.push(deferred.promise);
			});
			app.obj.model = [];
			return $q.all(promises);
		} else {
			deferred.resolve();
			return deferred.promise;
		}
	};
	
	// To get generic Hypercubes
	me.getHyperCube = function (dimensions, measures, callback, limit) {
		var qDimensions = [],
			qMeasures = [];
		if (dimensions.length) {
			angular.forEach(dimensions, function(value, key) {
				qDimensions.push({ 
					qDef: { 
						qGrouping: "N", 
						qFieldDefs: [ value ], 
					} 
				});
			});
		}
		if (measures.length) {
			angular.forEach(measures, function(value, key) {
				qMeasures.push({ 
					qDef : { 
						qDef : value
					}
				});
			});
		}
		app.obj.app.createCube({
			qDimensions : qDimensions,
			qMeasures : qMeasures,
			qInitialDataFetch : [{
				qTop : 0,
				qLeft : 0,
				qHeight : (limit)?limit:500,
				qWidth : 11
			}]
		}, function(reply) {
			utility.log('getMeasureData:', 'Success!');
			callback(reply.qHyperCube.qDataPages[0].qMatrix);
		});
	};
    
    // To get generic Hypercube aggregated
	me.getHyperCubeQ = function (dimensions, measures, limit, sort) {
		var deferred = $q.defer();
		var qDimensions = [],
			qMeasures = [];
		if (dimensions.length) {
			angular.forEach(dimensions, function(value, key) {
				qDimensions.push({ 
					qDef: { 
						qGrouping: "N", 
						qFieldDefs: [ value ], 
						qSortCriterias: [{
							// qSortByAscii: (sort) ? sort : 1, //Sorts the field by alphabetical order (-1, 0, 1)
							qSortByAscii: (value==='SeriesName') ? 1 : 0, //Sorts the field by alphabetical order (-1, 0, 1)
							// qSortByLoadOrder: 1
                            //qMode: "S",
						}],
					} 
				});
			});
		}
		if (measures.length) {
			angular.forEach(measures, function(value, key) {
				qMeasures.push({ 
					qDef : { 
						qDef : value
					}
				});
			});
		}
		app.obj.app.createCube({
			qDimensions : qDimensions,
			qMeasures : qMeasures,
			qInitialDataFetch : [{
				qTop : 0,
				qLeft : 0,
				qHeight : (limit)?limit:500,
				qWidth : 20
			}]
		}, function(reply) {
			utility.log('getMeasureData:', 'Success!');
			deferred.resolve(reply.qHyperCube.qDataPages[0].qMatrix);
		});
		return deferred.promise;
	};

	me.getAllresults = function (dimensions, measures) {
		var deferred = $q.defer(),
			promises = [],
			qTotalData = [],
			qTotalData2 = [],
			qDimensions = [],
			qMeasures = [];
			
		if (dimensions.length) {
			angular.forEach(dimensions, function(value, key) {
				qDimensions.push({ 
					qDef: { 
						qGrouping: "N", 
						qFieldDefs: [ value ], 
						qSortCriterias: [{
							qSortByAscii: (value==='SeriesName') ? 1 : 0, 
						}],
					} 
				});
			});
		}
		if (measures.length) {
			angular.forEach(measures, function(value, key) {
				qMeasures.push({ 
					qDef : { 
						qDef : value
					}
				});
			});
		}
		app.obj.app.createCube({
			qDimensions : qDimensions,
			qMeasures : qMeasures
		}).then(function(model) {
			model.getHyperCubeData('/qHyperCubeDef', [{qTop: 0, qWidth: 20, qLeft: 0, qHeight: 500}]).then(function(data) {
				var columns = model.layout.qHyperCube.qSize.qcx;
				var totalheight = model.layout.qHyperCube.qSize.qcy;
				var pageheight = Math.floor(10000 / columns);
				var numberOfPages = Math.ceil(totalheight / pageheight);
				if (numberOfPages==1) {
					deferred.resolve(data.qDataPages[0].qMatrix);
				} else {
					utility.log('Download Started on', new Date());
					var Promise = $q;
					var promises = Array.apply(null, Array(numberOfPages)).map(function(data, index) {
						var page = {
							qTop: (pageheight * index) + index,
							qLeft: 0,
							qWidth: columns,
							qHeight: pageheight,
							index: index
						};						
						return model.getHyperCubeData('/qHyperCubeDef', [page]);
					}, this);					
					Promise.all(promises).then(function(data) {
						for (var j=0; j<data.length; j++) {
							for (var k=0; k<data[j].qDataPages[0].qMatrix.length; k++) {							
								qTotalData.push(data[j].qDataPages[0].qMatrix[k])
							}
						}
						utility.log('Download Ended on', new Date());
						deferred.resolve(qTotalData);
					});
				}
			})
		})
		return deferred.promise;
	}
    
	me.getFieldData = function (field, callback, title, sort) {
		app.obj.app.createList({
			qDef: {
				qGrouping: "H",
				qFieldDefs: [
					field
				],
				qSortCriterias: [{
					qSortByAscii: (sort) ? sort : 1, //Sorts the field by alphabetical order (-1, 0, 1)
					qSortByLoadOrder: 1
				}],
			},
			qInitialDataFetch: [{
				qTop : 0,
				qLeft : 0,
				qHeight : 1000,
				qWidth : 1
			}],
			qShowAlternatives: false,
		}, function(reply) {
			field = (title) ? title : field;
			utility.log('getFieldData:', 'Success!');
			callback(reply.qListObject.qDataPages[0].qMatrix);
		});
	};

	me.getFieldDataQ = function (field, title, sort) {
		var deferred = $q.defer();
		app.obj.app.createList({
			qDef: {
				qGrouping: "H",
				qFieldDefs: [
					field
				],
				qSortCriterias: [{
					qSortByAscii: (sort) ? sort : 1, //Sorts the field by alphabetical order (-1, 0, 1)
					qSortByLoadOrder: 1
				}],
			},
			qInitialDataFetch: [{
				qTop : 0,
				qLeft : 0,
				qHeight : 1000,
				qWidth : 1
			}],
			qShowAlternatives: false,
		}, function(reply) {
			field = (title) ? title : field;
			utility.log('getFieldData:', 'Success!');
			deferred.resolve(reply.qListObject.qDataPages[0].qMatrix);
		});
		return deferred.promise;
	};

	me.selectQ = function (field, title, sort) {
		var deferred = $q.defer();
		deferred.resolve(reply.qListObject.qDataPages[0].qMatrix);
		return deferred.promise;
	};

	// Add Google tracking
	me.ga = function (title) {
		ga('send', 'event', 'button', 'click', title, 1);
	};
});