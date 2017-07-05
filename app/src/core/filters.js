angular.module('evtviewer.core')

.filter('capitalize', function() {
	return function(input, all) {
		var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
		return (!!input && input.replace) ? input.replace(reg, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
	};
})

.filter('camelToSpaces', function() {
	return function(input, all) {
		return (!!input && input.replace) ? input.replace(/\s+/g, ' ').replace(/([a-z\d])([A-Z])/g, '$1 $2') : '';
	};
})

.filter('underscoresToSpaces', function() {
	return function(input, all) {
		return (!!input && input.replace) ? input.replace(/\_+/g, ' ') : '';
	};
})

.filter('uppercase', function() {
	return function(input, all) {
		return (!!input && input.toUpperCase) ? input.toUpperCase() : '';
	};
});