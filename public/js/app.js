var findMate = angular.module('findMate', ['ui.bootstrap',
	'ngRoute',
	'ngMaterial',
	'ngMap',
	'angularMoment',
	'angularjs-dropdown-multiselect',
	'ui.bootstrap.datetimepicker',
	'sticky',
	'ngAnimate',
	'toastr',
    'mdDateTime',
    'google.places',
    'oitozero.ngSweetAlert',
	'ui.utils'
]);

findMate.run(function (amMoment) {
	amMoment.changeLocale('ru');
});

findMate.constant('angularMomentConfig', {
	preprocess: 'unix', // optional
	timezone: 'Europe/Minsk' // optional
});

/*findMate.config(["$httpProvider", function ($httpProvider) {
    $httpProvider.defaults.transformResponse.push(function(responseData){
        convertDateStringsToDates(responseData);
        return responseData;
    });
}]);*/

//config material
findMate.config(function ($mdThemingProvider, toastrConfig) {
	$mdThemingProvider.theme('default')
		.primaryPalette('deep-purple', {
			'default': '400'
		})
		.accentPalette('deep-orange');

	angular.extend(toastrConfig, {
		closeButton: true,
		allowHtml: true,
		maxOpened: true,
		timeOut: 5000,
		newestOnTop: true,
		positionClass: 'toast-bottom-left'
	});
});

/*findMate.config(function($routeProvider) {
 $routeProvider

 // route for the home page
 .when('/', {
 templateUrl : './views/partials/map.ejs',
 controller  : 'mainController'
 })

 .when('/map', {
 templateUrl : './views/partials/map.ejs',
 controller  : 'mapController'
 })

 .when('/profile', {
 templateUrl : './views/profile.ejs',
 controller  : 'profileController'
 })

 .when('/meetings', {
 templateUrl : './views/meetings.ejs',
 controller  : 'meetingsController'
 })

 .when('meetings/:id', {
 templateUrl : './views/meeting.ejs',
 controller  : 'meetingsController'
 })

 .otherwise({
 redirectTo: '/main'
 });
 });*/

