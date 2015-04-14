// map controller
// public/map.js

findMate.controller('userController', ['$scope', '$http', '$routeParams', '$mdSidenav',
	 function($scope, $http, $routeParams, $mdSidenav) {

    // side nav
    $scope.toggleNav = function() {
       $mdSidenav('nav').toggle();
    };
}]);