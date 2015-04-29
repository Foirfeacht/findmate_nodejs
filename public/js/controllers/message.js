// map controller
// public/map.js

findMate.controller('messageController', ['$scope', '$http', '$mdSidenav', '$modal',
	function ($scope, $http, $mdSidenav, $modal) {
		// side nav
		$scope.toggleNav = function () {
			$mdSidenav('nav').toggle();
		};

		$http.get('/current_user')
			.success(function (data) {
				$scope.currentUser = data;
			})
			.error(function (data) {
				console.log('Error: ' + data);
			});

		

	}]);