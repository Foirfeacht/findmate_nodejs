findMate.controller('EditMeetingController', ['$scope', '$http', 'editService', '$modalInstance', 'moment',
                     function($scope, 
                              $http,  
                              editService,
                              $modalInstance,
                              moment) {

  // working with api

    $scope.meetingId = editService.meetingId;
    $scope.logged_in_user = editService.user;



    // init necessary data

    $scope.formData = {}
  
  //get single meeting
  $http.get('../api/meetings/' + $scope.meetingId)
        .success(function(data) {
            $scope.meeting = data;
            console.log(data);

            var meeting = $scope.meeting;


             //init formdata

             $scope.formData = {
                invitedUsers: meeting.invitedUsers,
                participants: meeting.participants,
                title: meeting.title,
                description: meeting.description,
                description: meeting.description,
                startDate: new Date(meeting.startDate),
                startTime: new Date(meeting.startTime),
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
      /*for (var i =0; i < data.length; i++){
        var user = data[i];
        user.username = user.facebook.name;
      }*/
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

  

  // datetimepicker              

  $scope.hstep = 1;
  $scope.mstep = 15;

  $scope.minDate = new Date();

  $scope.dateOptions = {
    showWeeks: false,
    startingDay: 1
  };

  $scope.showMeridian = false;

   $scope.format = 'yyyy/MM/dd';

   $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.formData.invitedUsers = $scope.invitedUsers;

  $scope.saveMeeting = function(id) {
	  console.log($scope.meetingId);
      $http.put('../api/meetings/' + id, $scope.formData)
              .success(function (data) {
                  console.log($scope.formData);
                  $scope.meetings = data;
                  console.log(data);                  
                  $scope.ok();
              })
              .error(function(data) {
                  console.log('Error: ', data);
              })
    };
}]);