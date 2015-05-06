// map controller
// public/map.js

findMate.controller('profileController', ['$scope', '$http', '$mdSidenav', '$modal', 'toastr', '$animate',
	function ($scope, $http, $mdSidenav, $modal, toastr, $animate) {
		// side nav
		$scope.toggleNav = function () {
			$mdSidenav('nav').toggle();
		};

		$scope.showMessageBox = false;

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

		// image selector
		$scope.toggleSelectorButton = true;
		$scope.facebookImage = false;
		$scope.vkontakteImage = false;
		$scope.selectImageButton = false;
		$scope.selectedImage = null;
		$scope.vkSelected = false;
		$scope.facebookSelected = false;

		$scope.toggleImageSelector = function () {
			$scope.toggleSelectorButton = false;
			$scope.selectImageButton = true;
			$scope.facebookImage = $scope.currentUser.facebook ? true : false;
			$scope.vkontakteImage = $scope.currentUser.vkontakte ? true : false;
		}

		$scope.selectImage = function (image, provider) {
			var user = $scope.currentUser;
			$scope.selectedImage = image;
			console.log($scope.selectedImage);
			if (user.facebook && image === user.facebook.image) {
				$scope.facebookSelected = true;
			}
			if (user.vk && image === user.vk.image) {
				$scope.vkSelected = true;
			}
		}

		$scope.changeProfileImage = function () {
			$scope.toggleSelectorButton = true;
			if ($scope.selectedImage) {
				var user = $scope.currentUser;
				var image = $scope.selectedImage;
				console.log(image);
				$http.put('/update_userimage/users/' + user._id, {image: image})
					.success(function (data) {
						$scope.currentUser = data;
						console.log(data);
						$scope.facebookImage = false;
						$scope.vkontakteImage = false;
						$scope.selectImageButton = false;
					})
					.error(function (data) {
						console.log('Error: ' + data);
					});
			}
			;
		}

		$scope.showConfirm = function (size) {
			var modalInstance = $modal.open({
				templateUrl: './public/partials/confirmRemove.tmpl.ejs',
				controller: 'confirmRemoveController',
				size: size,
				scope: $scope
			});
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