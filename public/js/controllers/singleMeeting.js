// map controller
// public/map.js

findMate.controller('singleMeetingController', ['$scope', '$http', '$routeParams', '$location', '$mdSidenav', '$modal', 'editService', 'moment',
                    function($scope, 
                             $http,
                             $routeParams, 
                             $location, 
                             $mdSidenav,
                             $modal,
                             editService,
							 moment){

    //init logged in user
    $scope.$watch('logged_in_user', function () {
        $scope.loadFriends();
    });

    $scope.$watch('currentMeeting', function () {
        $scope.currentMeetingId = $scope.currentMeeting._id;
		$scope.refresh();
    });

						$scope.refresh = function () {
							$http.get('../api/meetings/' + $scope.currentMeetingId)
								.success(function(data) {
									$scope.meeting = data;
									$scope.meeting.startDate = new Date($scope.meeting.startDate);
									$scope.meeting.startTime = new Date($scope.meeting.startTime);
									if ($scope.meeting.updated_at !== null){
										$scope.meeting.updated_at = new Date($scope.meeting.updated_at);
									};
									$scope.meeting.updated = moment($scope.meeting.updated_at).fromNow();
									$scope.meeting.created = moment($scope.meeting.created_at).fromNow();
									console.log(data);

									//button show filter
									$scope.showButton = function(array) {
										var id = $scope.logged_in_user._id;
										var i, obj;
										for (i = 0; i < array.length; ++i) {
											obj = array[i];
											if (obj._id == id) {
												return true;
											}
										};
										return false;
									};
								})
								.error(function (data) {
									console.log('Error: ' + data);
								});
						};


    // join meeting

    $scope.joinMeeting = function(id){

        $http.put('/join/meetings/' + id)
            .success(function (data) {
                $scope.meetings = data;
                console.log(data);
				$scope.refresh();
            })
            .error(function (data) {
                console.log('Error: ' + data);
            })
    };

    $scope.unjoinMeeting = function(id){

        $http.put('/unjoin/meetings/' + id)
            .success(function (data) {
                $scope.meetings = data;
                console.log(data);
				$scope.refresh();
            })
            .error(function (data) {
                console.log('Error: ' + data);
            })
    };

         $scope.loadFriends = function(){
             var friendsRequest = 'https://graph.facebook.com/' + $scope.logged_in_user.facebook.id + '/friends' + '?access_token=' + $scope.logged_in_user.facebook.token;
             $http.get(friendsRequest)
                 .success(function(data) {
                     $scope.friends = data.data;
                 })
                 .error(function (data) {
                     console.log('Error: ' + data);
                 });
         };

    // delete a todo after checking it
    $scope.deleteMeeting = function(id) {
        $http.delete('../api/meeting/' + id)
            .success(function (data) {
                $scope.meetings = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.declineInvitation = function(id){

        $http.put('/decline/meetings/' + id)
            .success(function (data) {
                $scope.meetings = data;
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            })
    };

    // side nav
    $scope.toggleNav = function() {
       $mdSidenav('nav').toggle();
    };

    //edit service update

    $scope.$watch('currentMeetingId', function() {
        editService.getId($scope.currentMeetingId, $scope.logged_in_user);
    });

    $scope.$on('valuesUpdated', function() {
        $scope.currentMeetingId = editService.meetingId;
        $scope.logged_in_user = editService.user;
    });

    // edit meeting dialog
    $scope.editMeeting = function(id){
        $scope.meetingId = id;
        console.log($scope.currentMeetingId);
        $scope.showDialog();
    };

    $scope.showDialog = function(size){
        var modalInstance = $modal.open({
          templateUrl: '../public/partials/editMeeting.tmpl.ejs',
          controller: 'EditMeetingController',
          size: size
        });
        modalInstance.result.then(function(data) {
          $scope.refresh();
          console.log('refreshed')
        }, function() {
          $scope.refresh();
        })         
    };

    $scope.refresh = function(){
        $http.get('../api/meetings/' + $scope.currentMeetingId)
        	.success(function(data) {
				$scope.meeting = data;
				var meeting = $scope.meeting;
				console.log(data);
				meeting.startDate = new Date(meeting.startDate);
				meeting.startTime = new Date(meeting.startTime);
				if (meeting.updated_at !== null){
					meeting.updated_at = new Date(meeting.updated_at);
				};
				meeting.updated = moment(meeting.updated_at).fromNow();
				meeting.created = moment(meeting.created_at).fromNow();
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });
    }
						// submit comments

						$scope.commentData = {
							content: ''
						};

						$scope.submitComment = function () {
							$http.put('/addComment/meetings/' + $scope.currentMeetingId, $scope.commentData)
								.success(function (data) {
									console.log(data);
									console.log($scope.commentData);
									$scope.commentData = {}; // clear the form so our user is ready to enter another
									$scope.meetings = data;
									$scope.refresh();
									//deferred.resolve(data);
								})
								.error(function(data) {
									console.log('Error: ' + data);
								})
						};

    
}]);