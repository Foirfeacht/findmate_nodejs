// map controller
// public/map.js

findMate.controller('singleMeetingController', ['$scope', '$http', '$routeParams', '$location', '$mdSidenav', 
                    function($scope, 
                             $http,
                             $routeParams, 
                             $location, 
                             $mdSidenav) {
    //init logged in user
    $scope.$watch('logged_in_user', function () {
        $scope.loadFriends();
    });



    //update meeting
    $scope.updateMeeting = function (id) {
        // not implemented yet
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
}]);