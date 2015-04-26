// map controller
// public/map.js

findMate.controller('userController', ['$scope', '$http', '$routeParams', '$mdSidenav',
	 function($scope, $http, $routeParams, $mdSidenav) {

	$http.get('/current_user')
	     .success(function(data) {
			$scope.currentUser = data;
			$scope.loadFriends();
			$scope.refresh();
		 })
		.error(function (data) {
			console.log('Error: ' + data);
		});

    // side nav
    $scope.toggleNav = function() {
       $mdSidenav('nav').toggle();
    };
}]);