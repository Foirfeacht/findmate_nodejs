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
	      $http.get('/current_user')
	        .success(function (data) {
	          $scope.currentUser = data;
	          $scope.addedNotification = $scope.currentUser.notifications[$scope.currentUser.notifications.length - 1];
	          $scope.showNotification();
	        })
	        .error(function (data) {
	          console.log('Error: ' + data);
	        });
	    });

	    //notification
	    $scope.showNotification = function() {
	      $mdToast.show({
	        controller: 'notificationController',
	        templateUrl: './public/partials/invite-notification.ejs',
	          hideDelay: 0,
	        position: 'bottom right',
	        scope: $scope
	      });
	    };
	}]);