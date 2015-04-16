var findMate = angular.module('findMate', ['ui.bootstrap', 
                                            'ngRoute', 
                                            'ngMaterial', 
                                            'ngMap', 
                                            'angularMoment', 
                                            'angularjs-dropdown-multiselect',
											'ui.bootstrap.datetimepicker'
                                            ]);

findMate.run(function(amMoment) {
    amMoment.changeLocale('ru');
});

findMate.constant('angularMomentConfig', {
    preprocess: 'unix', // optional
    timezone: 'Europe/Minsk' // optional
});

findMate.filter('filterByFriends', function () {
  return function (item) {
  		if (item.facebook.name){};
      return item.toUpperCase();
  };
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

