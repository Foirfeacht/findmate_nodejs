// map controller
// public/map.js

findMate.controller('singleMeetingController', ['$scope', '$http', '$routeParams', '$location', '$mdSidenav', '$mdDialog', 'editService',
                    function($scope, 
                             $http,
                             $routeParams, 
                             $location, 
                             $mdSidenav,
                             $mdDialog,
                             editService){
    //init logged in user
    $scope.$watch('logged_in_user', function () {
        $scope.loadFriends();
    });

    $scope.$watch('currentMeeting', function () {
        $scope.currentMeetingId = $scope.currentMeeting._id;
        $scope.currentMeeting.startDate = new Date($scope.currentMeeting.startDate);
         $scope.currentMeeting.startTime = new Date($scope.currentMeeting.startTime);
         if ($scope.currentMeeting.updated_at !== null){
            $scope.currentMeeting.updated_at = new Date($scope.currentMeeting.updated_at);
         }
         $scope.currentMeeting.updated = moment($scope.currentMeeting.updated_at).fromNow();
         $scope.currentMeeting.created = moment($scope.currentMeeting.created_at).fromNow();
    });

    
    

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
                        console.log(meeting);
                     }
                     
                 }

            })
            .error(function (data) {
                console.log('Error: ' + data);
            })
    };

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
                 }
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
                var meetings = $scope.meetings;
                console.log(data);
                var meetingsLength = meetings.length;
                 for(var i = 0; i < meetingsLength; i++) {
                     var meeting = meetings[i];
                     if (meeting._id === id){
                        meeting.invited = false;
                        console.log(meeting);
                     }     
                 }
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
          templateUrl: '../public/partials/editMeeting.tmpl.ejs',
          targetEvent: ev
             }).then(function(data) {
                  $scope.refresh();
                  console.log('refreshed')
             }, function() {
                  $scope.refresh();
             })     
    };

    $scope.refresh = function(){
        $http.get('../api/meetings/' + currentMeetingId)
        .success(function(data) {
            $scope.meeting = data;
            var meeting = $scope.meeting;
            console.log(data);
            var dateNow = new Date().toJSON();           

                 //remove duplicates, delete this part later
                 meeting.invitedUsers = _.uniq(meeting.invitedUsers,
                    function(item, key, a){
                        return item.a;
                    });

                 meeting.joinedUsers = _.uniq(meeting.joinedUsers,
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

                 meeting.startDate = new Date(meeting.startDate);
	             meeting.startTime = new Date(meeting.startTime);
	             if (meeting.updated_at !== null){
	             	meeting.updated_at = new Date(meeting.updated_at);
	             }
	             meeting.updated = moment(meeting.updated_at).fromNow();
	             meeting.created = moment(meeting.created_at).fromNow();

                 //invited filter
                 var invitedArray = meeting.invitedUsers;
                 var invitedArrayLength = invitedArray.length;
                 for (var u = 0; u< invitedArrayLength; u++){
                    var invitedUser = invitedArray[u];
                    if(invitedUser._id === $scope.logged_in_user._id){
                        meeting.invited = true;
                    } else {
                        meeting.invited = false;
                    }
                    console.log(meeting.invited);
                 }// end invited filter

                 // participants filter
                 var joinedArray = meeting.joinedUsers;
                 var joinedArrayLength = joinedArray.length;
                 for (var j = 0; j < joinedArrayLength; j++){
                    var joinedUser = joinedArray[j];
                    if(joinedUser._id === $scope.logged_in_user._id){
                        meeting.joined = true;
                    } else {
                        meeting.joined = false;
                    }
                    console.log(meeting.joined);
                 }// end participants filter

        })
        .error(function (data) {
            console.log('Error: ' + data);
        });
    }

    /*$scope.refresh = function(){
        $http.get('../api/meetings')
        .success(function(data) {
            $scope.meetings = data;
            var meetings = $scope.meetings;
            console.log(data);
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

                 //invited filter
                 var invitedArray = meeting.invitedUsers;
                 var invitedArrayLength = invitedArray.length;
                 for (var u = 0; u< invitedArrayLength; u++){
                    var invitedUser = invitedArray[u];
                    if(invitedUser._id === $scope.logged_in_user._id){
                        meeting.invited = true;
                    } else {
                        meeting.invited = false;
                    }
                    console.log(meeting.invited);
                 }// end invited filter

                 // participants filter
                 var participantsArray = meeting.participants;
                 var participantsArrayLength = participantsArray.length;
                 for (var j = 0; j < participantsArrayLength; j++){
                    var joinedUser = participantsArray[j];
                    if(joinedUser._id === $scope.logged_in_user._id){
                        meeting.joined = true;
                    } else {
                        meeting.joined = false;
                    }
                    console.log(meeting.joined);
                 }// end participants filter

             }; // end for loop
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });
    }*/
}]);