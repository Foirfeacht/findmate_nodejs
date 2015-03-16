var findMate = angular.module('findMate', ['ui.bootstrap', 'ngRoute', 'ngMaterial']);

/*findMate.config(function($routeProvider) {
        $routeProvider

            // route for the home page
            .when('/main', {
                templateUrl : './views/map.ejs',
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

            .when('meetings', {
                templateUrl : './views/meetings.ejs',
                controller  : 'meetingsController'
            })

            .when('api/meetings/:id', {
                templateUrl : './views/meeting.ejs',
                controller  : 'meetingsController'
            })

            .otherwise({
		        redirectTo: '/main'
		    });
});

*/