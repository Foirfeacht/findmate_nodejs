// map controller
// public/map.js

findMate.controller('meetingsController', ['$scope', 
                                            '$http', 
                                            '$routeParams',
                                            '$mdSidenav',
                                            '$filter',
                                            'dateFilter',
                                            'editService',
                                            '$mdDialog',
	 function($scope, $http, $routeParams, $mdSidenav, $filter, date, editService, $mdDialog) {


    //init logged in user
	$scope.$watch('logged_in_user', function () {
		$scope.loadFriends();
	});


    $scope.refresh = function(){
        $http.get('../api/meetings')
        .success(function(data) {
            $scope.meetings = data;
            var meetings = $scope.meetings;
            console.log(data);
             $scope.loopMeetings(meetings);
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });
    }

    
    // when landing on the page, get all events and show them
    $scope.refresh();
    /*$http.get('../api/meetings')
        .success(function(data) {
            $scope.meetings = data;
            var meetings = $scope.meetings;
            console.log(data);
            $scope.loopMeetings(meetings);
            
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });*/


    $scope.loopMeetings = function(meetings){
        var dateNow = new Date().toJSON();

        // loop through data
        var meetingsLength = meetings.length;
         for(var i = 0; i < meetingsLength; i++) {
             var meeting = meetings[i];

             //remove duplicates, delete this part later
             meeting.invitedUsers = _.uniq(meeting.invitedUsers,
                function(item, key, a){
                    return item.a;
                });

             meeting.participants = _.uniq(meeting.participants,
                function(item, key, a){
                    return item.a;
                });

             // date filter
             var meetingDate = meeting.startDate;
             if (meetingDate > dateNow){
                 meeting.active = true;
             } else {
                meeting.active = false;
             };// end date filter

             //format dates
             meeting.startDate = new Date(meeting.startDate);
             meeting.startTime = new Date(meeting.startTime);
             if (meeting.updated_at !== null){
             	meeting.updated_at = new Date(meeting.updated_at);
             }
              

             //invited filter
             var invitedArray = meeting.invitedUsers;
             var invitedArrayLength = invitedArray.length;
             for (var u = 0; u< invitedArrayLength; u++){
                var invitedUser = invitedArray[u];
                if(invitedUser._id === $scope.logged_in_user._id){
                    meeting.invited = true;
                } else {
                    meeting.invited = false;
                };
             };// end invited filter

             // participants filter
             var participantsArray = meeting.participants;
             var participantsArrayLength = participantsArray.length;
             for (var j = 0; j < participantsArrayLength; j++){
                var joinedUser = participantsArray[j];
                if(joinedUser._id === $scope.logged_in_user._id){
                    meeting.joined = true;
                } else {
                    meeting.joined = false;
                };
             };// end participants filter

         }; // end for loop
    }

    //get users

    $http.get('../api/users')
        .success(function(data) {
            $scope.users = data;
            console.log(data);
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });

      $scope.singleUser = function(id) {
        $http.get('../api/users' + id)
            .success(function(data) {
                $scope.users = data;
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };


    // delete a meeting
    $scope.deleteMeeting = function(id) {
        $http.delete('../api/meetings/' + id)
            .success(function (data) {
                $scope.meetings = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    //update meeting
    $scope.updateMeeting = function (id) {
        // not implemented yet
    };

    // decline invitation

    $scope.declineInvitation = function(id){

        $http.put('/decline/meetings/' + id)
            .success(function (data) {
                $scope.meetings = data;
                var meetings = $scope.meetings;
                console.log(data);
                var meetingsLength = meetings.length;
                 for(var i = 0; i < meetingsLength; i++) {
                     var meeting = meetings[i];
                     if (meeting._id === id){
                        meeting.invited = false;
                        console.log(meeting);
                     }  
                 };
                 $scope.refresh();

            })
            .error(function (data) {
                console.log('Error: ' + data);
            })
    };

    // join meeting

    $scope.joinMeeting = function(id){

        $http.put('/join/meetings/' + id)
            .success(function (data) {
                $scope.meetings = data;
                var meetings = $scope.meetings;
                console.log(data);
                var meetingsLength = meetings.length;
                 for(var i = 0; i < meetingsLength; i++) {
                     var meeting = meetings[i];
                     if (meeting._id === id){
                        meeting.joined = true;
                        meeting.invited = false;
                        console.log(meeting);
                     }                    
                 }
                 $scope.refresh();
            })
            .error(function (data) {
                console.log('Error: ' + data);
            })
    };

    // unjoin meeting

    $scope.unjoinMeeting = function(id){

        $http.put('/unjoin/meetings/' + id)
            .success(function (data) {
                $scope.meetings = data;
                var meetings = $scope.meetings;
                console.log(data);
                var meetingsLength = meetings.length;
                 for(var i = 0; i < meetingsLength; i++) {
                     var meeting = meetings[i];
                     if (meeting._id === id){
                        meeting.joined = false;
                        console.log(meeting);
                     }                  
                 };
                 $scope.refresh();

            })
            .error(function (data) {
                console.log('Error: ' + data);
            })
    };

    // category filter

        var todayDate = new Date();
        $scope.todayDay = todayDate.getDate();

        $scope.categories = [{name: 'Спорт'}, {name: 'Развлечения'}];

        $scope.visibilities = [{name: 'Общие'}, {name: 'Друзья'}];


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
		 
    //tabs
    $scope.data = {
      selectedIndex : 0
    };
    $scope.next = function() {
      $scope.data.selectedIndex = Math.min($scope.data.selectedIndex + 1, 2) ;
    };
    $scope.previous = function() {
      $scope.data.selectedIndex = Math.max($scope.data.selectedIndex - 1, 0);
    };

    // side nav
    $scope.toggleNav = function() {
       $mdSidenav('nav').toggle();
    };

    //edit service update

    $scope.$watch('meetingId', function() {
        editService.getId($scope.meetingId, $scope.logged_in_user);
    });

    $scope.$on('valuesUpdated', function() {
        $scope.meetingId = editService.meetingId;
        $scope.logged_in_user = editService.user;
    });

    // edit meeting dialog
    $scope.editMeeting = function(id){
        $scope.meetingId = id;
        console.log($scope.meetingId);
        $scope.showDialog();
    };

    $scope.showDialog = function(ev){
        $mdDialog.show({
          controller: 'EditMeetingController',
          templateUrl: './public/partials/editMeeting.tmpl.ejs',
          targetEvent: ev
             }).then(function(data) {
                  $scope.refresh();
                  console.log('refreshed')
             }, function() {
                  $scope.refresh();
             })     
    };

    
}]);