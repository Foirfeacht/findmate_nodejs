findMate.controller('settingsController', ['$scope', '$http', '$mdSidenav', '$modal', 'toastr', '$animate', 'SweetAlert',
	function ($scope, $http, $mdSidenav, $modal, $animate, toastr, SweetAlert) {
		// side nav
		$scope.toggleNav = function () {
			$mdSidenav('nav').toggle();
		};

        $scope.contenLoaded = false;

		$scope.getCurrentUser = function () {
			$http.get('/current_user')
				.success(function (data) {
					$scope.currentUser = data;
					console.log($scope.currentUser);
                    $scope.contenLoaded = true;
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


        $scope.showConfirm = function () {
            SweetAlert.swal({
                    title: "Вы уверены, что хотите удалить аккаунт",
                    text: "Все созданные вами встречи будут удалены",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Да, удалить",
                    cancelButtonText: "Нет",
                    closeOnConfirm: false},
                function(isConfirm){
                    if(isConfirm){
                        $http.delete('/users/delete/' + $scope.currentUser._id)
                            .success(function (data) {
                                console.log(data);
                            })
                            .error(function (data) {
                                console.log('Error: ' + data);
                            });
                        window.location.href = "/logout"
                    };
                });
        };

        $scope.connectFacebook = function(){
          if($scope.facebook === false){
              $http.get('/connect/facebook')
                  .success(function (data) {
                      $scope.facebook = true;
                      console.log($scope.facebook);
                  })
                  .error(function (data) {
                      console.log('Error: ' + data);
                  });
          } else {
              $http.get('/unlink/facebook')
                  .success(function (data) {
                      $scope.facebook = false;
                      console.log($scope.facebook);
                  })
                  .error(function (data) {
                      console.log('Error: ' + data);
                  });
          }
        };

        $scope.connectVk = function(){
            if($scope.vkontakte === false){
                $http.get('/connect/vk')
                    .success(function (data) {
                        $scope.vkontakte = true;
                        console.log($scope.vkontakte);
                    })
                    .error(function (data) {
                        console.log('Error: ' + data);
                    });
            } else {
                $http.get('/unlink/vk')
                    .success(function (data) {
                        $scope.vkontakte = false;
                        console.log($scope.vkontakte);
                    })
                    .error(function (data) {
                        console.log('Error: ' + data);
                    });
            }
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

		socket.on('push notification about update', function (data) {
			console.log(data.msg);

			if(data.msg._id === $scope.currentUser._id){
				$http.get('/current_user')
					.success(function (data) {
						$scope.currentUser = data;
						$scope.showUpdateNotification();
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

		//updated notification
		$scope.showUpdateNotification = function() {
			$scope.addedNotification = $scope.currentUser.notifications[$scope.currentUser.notifications.length - 1];
			console.log($scope.addedNotification);
			$scope.thisCanBeusedInsideNgBindHtml = $sce.trustAsHtml('<h1>' + $scope.addedNotification.meeting.title + '</h1>');
			toastr.info( 'Встреча изменена!',
				'<div ng-bind-html="thisCanBeusedInsideNgBindHtml"></div>', {
					allowHtml: true
					//onclick: $scope.redirectToMeeting($scope.addedNotification.meeting._id)
				});
		};

		$scope.invited = function (notification) {
			var array = notification.meeting.invitedUsers;
			var id = $scope.currentUser._id;
			var i, obj;
			for (i = 0; i < array.length; ++i) {
				obj = array[i];
				if (obj._id == id) {
					return true;
				};
			};
			return false;
		}

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
		});

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

		$scope.settingsData = {
			distance: 10 || $scope.currentUser.settings.distance / 1000
		};

		$scope.$watch('currentUser', function () {
				$scope.settingsData.distance = $scope.currentUser.settings.distance / 1000;
		});

		$scope.saveSettings = function () {
			$scope.settingsData.distance = 	$scope.settingsData.distance * 1000;		
			$http.put('/update_settings/users/' + $scope.currentUser._id, $scope.settingsData)
				.success(function (data) {
					$scope.currentUser = data;
					console.log(data);
				})
				.error(function (data) {
					console.log('Error: ' + data);
				});
		};
}]);