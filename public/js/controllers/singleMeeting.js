// map controller
// public/map.js

findMate.controller('singleMeetingController', ['$scope', '$http', '$routeParams', '$location', '$mdSidenav', '$modal', 'editService', 'moment', 'notificationService', '$mdToast', '$animate', 'toastr',
	function ($scope,
			  $http,
			  $routeParams,
			  $location,
			  $mdSidenav,
			  $modal,
			  editService,
			  notificationService,
			  moment,
			  $mdToast,
			  $animate,
			  toastr) {

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

		$scope.$watch('currentMeeting', function () {
			$scope.currentMeetingId = $scope.currentMeeting._id;
			$scope.refresh();
		});
		//listen for socket changes
		socket.on('meetings changed', function (data) {
			$scope.refresh();
		});

		//listen for socket changes
		socket.on('comment added', function (data) {
			$scope.refresh();
		});


		$scope.refresh = function () {
			$http.get('../api/meetings/' + $scope.currentMeetingId)
				.success(function (data) {
					$scope.meeting = data;
					$scope.meeting.startDate = new Date($scope.meeting.startDate);
					$scope.meeting.startTime = new Date($scope.meeting.startTime);
					if ($scope.meeting.updated_at !== null) {
						$scope.meeting.updated_at = new Date($scope.meeting.updated_at);
					}
					;
					$scope.meeting.updated = moment($scope.meeting.updated_at).fromNow();
					$scope.meeting.created = moment($scope.meeting.created_at).fromNow();
				})
				.error(function (data) {
					console.log('Error: ' + data);
				});
		};

		//button show filter
		$scope.showButton = function (array) {
			var id = $scope.currentUser._id;
			var i, obj;
			for (i = 0; i < array.length; ++i) {
				obj = array[i];
				if (obj._id == id) {
					return true;
				}
			}
			;
			return false;
		};

		$scope.loadFriends = function () {
			var friendsRequest = 'https://graph.facebook.com/' + $scope.currentUser.facebook.id + '/friends' + '?access_token=' + $scope.currentUser.facebook.token;
			$http.get(friendsRequest)
				.success(function (data) {
					$scope.friends = data.data;
				})
				.error(function (data) {
					console.log('Error: ' + data);
				});
		};

		// side nav
		$scope.toggleNav = function () {
			$mdSidenav('nav').toggle();
		};

		$scope.showMessageBox = false;

		//edit service update

		$scope.$watch('currentMeetingId', function () {
			editService.getId($scope.currentMeetingId, $scope.currentUser);
		});

		$scope.$on('valuesUpdated', function () {
			$scope.currentMeetingId = editService.meetingId;
			$scope.currentUser = editService.user;
		});

		// edit meeting dialog
		$scope.editMeeting = function (id) {
			$scope.meetingId = id;
			console.log($scope.currentMeetingId);
			$scope.showDialog();
		};

		$scope.showDialog = function (size) {
			var modalInstance = $modal.open({
				templateUrl: '../public/partials/editMeeting.tmpl.ejs',
				controller: 'EditMeetingController',
				size: size
			});
			modalInstance.result.then(function (data) {
				$scope.refresh();
				console.log('refreshed')
			}, function () {
				$scope.refresh();
			})
		};

		$scope.refresh = function () {
			$http.get('../api/meetings/' + $scope.currentMeetingId)
				.success(function (data) {
					$scope.meeting = data;
					var meeting = $scope.meeting;
					console.log(data);
					meeting.startDate = new Date(meeting.startDate);
					meeting.startTime = new Date(meeting.startTime);
					if (meeting.updated_at !== null) {
						meeting.updated_at = new Date(meeting.updated_at);
					}
					;
					meeting.updated = moment(meeting.updated_at).fromNow();
					meeting.created = moment(meeting.created_at).fromNow();
				})
				.error(function (data) {
					console.log('Error: ' + data);
				});
		};

		// delete a meeting
		$scope.deleteMeeting = function (id) {
			$http.delete('/remove/meetings/' + id)
				.success(function (data) {
					console.log('removed');
				})
				.error(function (data) {
					console.log('Error: ' + data);
				});
		};
		// submit comments

		$scope.commentData = {
			content: ''
		};

		$scope.submitComment = function () {
			$http.put('/addComment/meetings/' + $scope.currentMeetingId, $scope.commentData)
				.success(function (data) {
					$scope.commentData = {}; // clear the form so our user is ready to enter another
				})
				.error(function (data) {
					console.log('Error: ', data);
				})
		};

		//delete comments
		// delete a meeting
		$scope.deleteComment = function (id) {
			$http.put('/delete/meetings/' + $scope.currentMeetingId + '/comments/' + id)
				.success(function (data) {

				})
				.error(function (data) {
					console.log('Error: ' + data);
				});
		};

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
			};
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

		//notification service update
		$scope.$watch('addedNotification', function () {
			console.log($scope.addedNotification);
			notificationService.getNotification($scope.addedNotification);
		});

		$scope.$on('notificationUpdated', function () {
			$scope.addedNotification = editService.notification;
		});

	}]);