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
		.primaryPalette('yellow', {
			'default': 'A400' 
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

var regexIso8601 = /^(\d{4}|\+\d{6})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})\.(\d{1,})(Z|([\-+])(\d{2}):(\d{2}))?)?)?)?$/;

function convertDateStringsToDates(input) {
    // Ignore things that aren't objects.
    if (typeof input !== "object") return input;

    for (var key in input) {
        if (!input.hasOwnProperty(key)) continue;

        var value = input[key];
        var match;
        // Check for string properties which look like dates.
        if (typeof value === "string" && (match = value.match(regexIso8601))) {
            var milliseconds = Date.parse(match[0]);
            if (!isNaN(milliseconds)) {
                var options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
                input[key] = new Date(milliseconds).toLocaleString('ru-RU', options);
            };
        } else if (typeof value === "object") {
            // Recurse into object
            convertDateStringsToDates(value);
        };
    };
};

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

