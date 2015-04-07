findMate.controller('EditMeetingController', ['$scope', '$http', 'editService', '$mdDialog', 'moment',
                     function($scope, 
                              $http,  
                              editService,
                              $mdDialog,
                              moment) {

  // working with api

    $scope.meetingId = editService.meetingId;
    $scope.logged_in_user = editService.user;
    console.log($scope.meetingId);


    // init necessary data

    $scope.formData = {}
  
  //get single meeting
  $http.get('../api/meetings/' + $scope.meetingId)
        .success(function(data) {
            $scope.meeting = data;
            console.log(data);

            var meeting = $scope.meeting;

             //remove duplicates, delete this part later
             meeting.invitedUsers = _.uniq(meeting.invitedUsers,
                function(item, key, a){
                    return item.a;
                });

             meeting.participants = _.uniq(meeting.participants,
                function(item, key, a){
                    return item.a;
                });

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

             //init formdata

             $scope.formData = {
                invitedUsers: meeting.invitedUsers,
                participants: meeting.participants,
                title: meeting.title,
                description: meeting.description,
                description: meeting.description,
                startDate: moment(meeting.startDate),
                startTime: moment(meeting.startTime),
                updated_at: new Date(),
                visibility: meeting.visibility,
                id: meeting._id
             }

        })
        .error(function (data) {
            console.log('Error: ' + data);
        });

  // deal with users
  $http.get('../api/users')
    .success(function(data) {
      $scope.users = data;
      console.log(data);
      for (var i =0; i < data.length; i++){
        var user = data[i];
        user.username = user.facebook.name;
      }
    })
    .error(function (data) {
      console.log('Error: ' + data);
    });

    $scope.pushFriends = function(){
      var users = $scope.users;
      var friends = $scope.friends;
      var userLength = users.length;
      var friendsLength = friends.length;
      for (var i = 0; i<userLength; i++){
        var user = users[i];
        var id = user.facebook.id;
        for (var u = 0; u<friendsLength; u++){
          var friend = friends[u];
          if (id === friend.id){
            $scope.friendUsers.push(user);
          }
        }
      }
    }

    $scope.loadFriends = function(user){
       var user = user
       var friendsRequest = 'https://graph.facebook.com/' + user.facebook.id + '/friends' + '?access_token=' + user.facebook.token;
       $http.get(friendsRequest)
         .success(function(data) {
           $scope.friends = data.data;    
           $scope.pushFriends();
         })
         .error(function (data) {
           console.log('Error: ' + data);
         });
     };

     

    $scope.friendUsers = [];
    $scope.invitedUsers = [];
    $scope.invitedUsersSettings = {
        scrollableHeight: '200px',
        scrollable: true,
        enableSearch: true,
        displayProp: 'username',
        idProp: '_id',
        externalIdProp: ''
    };
    $scope.invitedUsersText = {
        buttonDefaultText: 'Пригласить друзей'
    };

  
  Date.prototype.timeNow = function () {
     return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
  };

  $scope.hide = function() {
    $mdDialog.hide();
  };

  $scope.cancel = function() {
    $mdDialog.cancel();
  };



  $scope.formData.invitedUsers = $scope.invitedUsers;

  $scope.saveMeeting = function() {
      $http.post('edit/meetings/' + $scope.formData.id, $scope.formData)
              .success(function (data) {
                  console.log($scope.formData);
                  $scope.formData = {}; // clear the form so our user is ready to enter another
                  $scope.meetings = data;
                  console.log(data);                  
                  $scope.hide();
              })
              .error(function(data) {
                  console.log('Error: ' + data);
              })
    };
}]);