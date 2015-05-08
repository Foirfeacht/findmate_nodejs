// map controller
// public/map.js

findMate.controller('meetingsController', ['$scope',
	'$http',
	'$routeParams',
	'$mdSidenav',
	'$filter',
	'dateFilter',
	'editService',
	'restService',
	'$modal',
	'toastr',
	'$animate',
	function ($scope, $http, $routeParams, $mdSidenav, $filter, date, editService, $modal, restService, toastr, $animate) {

		//expose lodash to scope
		$scope._ = _;

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

		$scope.refresh = function () {
			$http.get('../api/meetings')
				.success(function (data) {
					$scope.meetings = data;
					var meetings = $scope.meetings;
					console.log(data);
					$scope.loopMeetings(meetings);
				})
				.error(function (data) {
					console.log('Error: ' + data);
				});
		};

		$scope.refresh();

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


		//get users

		$http.get('../api/users')
			.success(function (data) {
				$scope.users = data;
				console.log(data);
			})
			.error(function (data) {
				console.log('Error: ' + data);
			});

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

		//listen for socket changes
		socket.on('meetings changed', function (data) {
			console.log(data);
			$scope.$apply(function () {
				$scope.meetings = data.msg;
			});
			console.log($scope.meetings);
		});

		socket.on('push notification added', function (data) {
			console.log(data.msg);
			$http.get('/current_user')
				.success(function (data) {
					$scope.currentUser = data;
				})
				.error(function (data) {
					console.log('Error: ' + data);
				});
		});

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

		$scope.checkOwner = function (id) {
			var currentUserId = $scope.currentUser._id;
			if (id === currentUserId) {
				return true;
			};
			return false;
		};

		$scope.checkDate = function (meeting) {
			var dateNow = new Date().toJSON();
			if (meeting.startDate > dateNow) {
				return true;
			} else {
				return false;
			};
		};

		// check active status and format date
		$scope.loopMeetings = function (meetings) {
			var meetings = meetings;
			var dateNow = new Date().toJSON();

			// loop through data
			var meetingsLength = meetings.length;
			for (var i = 0; i < meetingsLength; i++) {
				var meeting = meetings[i];

				//format dates
				meeting.startDate = new Date(meeting.startDate);
				if (meeting.updated_at !== null) {
					meeting.updated_at = new Date(meeting.updated_at);
				}
				meeting.updated = moment(meeting.updated_at).fromNow();
				meeting.created = moment(meeting.created_at).fromNow();

			}
			; // end for loop
		};

		// delete a meeting
		$scope.deleteMeeting = function (id) {
			$http.delete('../api/meetings/' + id)
				.success(function (data) {
					// $scope.meetings = data;
				})
				.error(function (data) {
					console.log('Error: ' + data);
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

		// category filter

		var todayDate = new Date();
		$scope.todayDay = todayDate.getDate();

		//datepicker

		$scope.dateOptions = {
			formatYear: 'yy',
			startingDay: 1
		};

		$scope.showMeridian = false;
		$scope.hstep = 1;
		$scope.mstep = 15;

		$scope.format = 'yyyy/MM/dd';

		$scope.categories = [{name: 'Спорт'}, {name: 'Развлечения'}];

		$scope.visibilities = [{name: 'Общие'}, {name: 'Друзья'}];

		//tabs
		$scope.data = {
			selectedIndex: 0
		};
		$scope.next = function () {
			$scope.data.selectedIndex = Math.min($scope.data.selectedIndex + 1, 2);
		};
		$scope.previous = function () {
			$scope.data.selectedIndex = Math.max($scope.data.selectedIndex - 1, 0);
		};

		// side nav
		$scope.toggleNav = function () {
			$mdSidenav('nav').toggle();
		};

		$scope.showMessageBox = false;

		//edit service update

		$scope.$watch('meetingId', function () {
			editService.getId($scope.meetingId, $scope.currentUser);
		});

		$scope.$on('valuesUpdated', function () {
			$scope.meetingId = editService.meetingId;
			$scope.currentUser = editService.user;
		});

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

		// edit meeting dialog
		$scope.editMeeting = function (id) {
			$scope.meetingId = id;
			$scope.showDialog();
		};

		$scope.showDialog = function (size) {
			var modalInstance = $modal.open({
				templateUrl: './public/partials/editMeeting.tmpl.ejs',
				controller: 'EditMeetingController',
				size: size
			});
		};
	}]);