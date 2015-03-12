// map controller
// public/map.js

findMate.controller('profileController', ['$scope', '$http', '$mdSidenav', function($scope, $http, $mdSidenav) {
	// side nav
    $scope.toggleNav = function() {
       $mdSidenav('nav').toggle();
    };
    
}]);