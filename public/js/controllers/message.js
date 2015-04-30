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

		// decline invitation

		$scope.declineInvitation = function (id) {
			$http.put('/decline/meetings/' + id)
				.success(function (data) {
					//$scope.meetings = data;
					//console.log(data);
				})
				.error(function (data) {
					console.log('Error: ' + data);
				});
		};

		// join meeting

		$scope.joinMeeting = function (id) {
			$http.put('/join/meetings/' + id)
				.success(function (data) {
					//$scope.meetings = data;
					//console.log(data);
				})
				.error(function (data) {
					console.log('Error: ' + data);
				});

		};

		// unjoin meeting

		$scope.unjoinMeeting = function (id) {

			$http.put('/unjoin/meetings/' + id)
				.success(function (data) {
					//$scope.meetings = data;
					//console.log(data);
				})
				.error(function (data) {
					console.log('Error: ' + data);
				})
		};
		

	}]);