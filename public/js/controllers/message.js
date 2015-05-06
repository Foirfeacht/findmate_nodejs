// map controller
// public/map.js

findMate.controller('messageController', ['$scope', '$http', '$mdSidenav', '$modal', 'toastr', 'animate',
	function ($scope, $http, $mdSidenav, $modal, $animate, toastr) {
		// side nav
		$scope.toggleNav = function () {
			$mdSidenav('nav').toggle();
		};

		$scope.getCurrentUser = function () {
			$http.get('/current_user')
				.success(function (data) {
					$scope.currentUser = data;
					console.log($scope.currentUser);
				})
				.error(function (data) {
					console.log('Error: ' + data);
				});
		};

		$scope.getCurrentUser();

		// decline invitation
		$scope.declineInvitation = function (id) {
			$http.put('/decline/meetings/' + id)
				.success(function (data) {
				})
				.error(function (data) {
					console.log('Error: ' + data);
				});
			$scope.getCurrentUser();
		};

		// join meeting
		$scope.joinMeeting = function (id) {
			$http.put('/join/meetings/' + id)
				.success(function (data) {
				})
				.error(function (data) {
					console.log('Error: ' + data);
				});
			$scope.getCurrentUser();

		};

		// unjoin meeting
		$scope.unjoinMeeting = function (id) {
			$http.put('/unjoin/meetings/' + id)
				.success(function (data) {
				})
				.error(function (data) {
					console.log('Error: ' + data);
				});
			$scope.getCurrentUser();
		};

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
			$scope.addedNotification = $scope.currentUser.notifications[$scope.currentUser.notifications.length - 1];
			console.log($scope.addedNotification);
			/*$mdToast.show({
			 controller: 'notificationController',
			 templateUrl: './public/partials/invite-notification.ejs',
			 hideDelay: 6000,
			 position: 'bottom left'
			 });*/
			toastr.info('{{$scope.addedNotification.meeting.title}}',
				'Приглашение от {{$scope.addedNotification.owner.name}}!', {
					allowHtml: true
					//onclick: $scope.redirectToMeeting($scope.addedNotification.meeting._id)
				});
		};

		$scope.deleteNotification = function(id){
			$http.put('/deleteNotification/users/' + $scope.currentUser._id + '/notifications/' + id)
				.success(function (data) {
				})
				.error(function (data) {
					console.log('Error: ' + data);
				});
		};

		$scope.declineNotification = function(id, meetingId){
			$http.put('/declineNotification/users/' + $scope.currentUser._id + '/notifications/' + id + '/' + meetingId)
				.success(function (data) {
				})
				.error(function (data) {
					console.log('Error: ' + data);
				});
		};

		socket.on('push notification removed', function (data) {
			$scope.currentUser = data.msg;
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