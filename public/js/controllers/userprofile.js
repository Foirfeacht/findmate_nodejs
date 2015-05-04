// map controller
// public/map.js

findMate.controller('userController', ['$scope', '$http', '$routeParams', '$mdSidenav',
	function ($scope, $http, $routeParams, $mdSidenav) {

		$http.get('/current_user')
			.success(function (data) {
				$scope.currentUser = data;
				$scope.loadFriends();
				$scope.refresh();
			})
			.error(function (data) {
				console.log('Error: ' + data);
			});

		// side nav
		$scope.toggleNav = function () {
			$mdSidenav('nav').toggle();
		};

		$scope.showMessageBox = false;

		//push notifications

	    socket.on('push notification added', function (data) {
			console.log(data.msg);

			if(data.msg._id === $scope.currentUser._id){
				$http.get('/current_user')
					.success(function (data) {
						$scope.currentUser = data;
						$scope.addedNotification = $scope.currentUser.notifications[$scope.currentUser.notifications.length - 1];
						console.log($scope.addedNotification);
						$scope.showNotification();
					})
					.error(function (data) {
						console.log('Error: ' + data);
					});
			}
		});

		//notification
		$scope.showNotification = function() {
			$mdToast.show({
				controller: 'notificationController',
				templateUrl: './public/partials/invite-notification.ejs',
				hideDelay: 6000,
				position: 'bottom left',
				scope: $scope
			});
		};

		// decline invitation
		$scope.declineInvitation = function (id) {
			$http.put('/decline/meetings/' + id)
				.success(function (data) {
				})
				.error(function (data) {
					console.log('Error: ' + data);
				});
		};

		// join meeting
		$scope.joinMeeting = function (id) {
			$http.put('/join/meetings/' + id)
				.success(function (data) {
				})
				.error(function (data) {
					console.log('Error: ' + data);
				});

		};

		// unjoin meeting
		$scope.unjoinMeeting = function (id) {
			$http.put('/unjoin/meetings/' + id)
				.success(function (data) {
				})
				.error(function (data) {
					console.log('Error: ' + data);
				})
		};

		// ng show for buttons
		$scope.showButton = function (array) {
			var id = $scope.currentUser._id;
			var i, obj;
			for (i = 0; i < array.length; ++i) {
				obj = array[i];
				if (obj._id == id) {
					return true;
				};
			};
			return false;
		};
	}]);