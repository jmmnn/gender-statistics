'use strict';

/**
 * @ngdoc function
 * @name friluftsframjandetApp.controller: controllers.utility
 * @description
 * # Utility
 * Controller of the friluftsframjandetApp
 */
app.obj.angularApp
.service('utility', function ($q) {
	var me = this;

	// Convert 10000 into 10,000
	me.string2thousands = function (string) {
		if (string.length >= 6 ) {
			return string.replace(/(\d+)(\d{3})(\d{3})/, '$1' + ' ' + '$2' + ' ' + '$3');
		} else {
			return string.replace(/(\d+)(\d{3})/, '$1' + ' ' + '$2');
		}
	}

	me.truncateText = function (string, limit) {
		var stringLimit = (limit) ? limit : 20;
		return (string.length > stringLimit) ?  string.substring(0, stringLimit) + '...': string;
	}

	// Custom Logger
	me.log = function (type, message) {
		console.log('%c ' + type + ': ', 'color: red', message);
	};

});