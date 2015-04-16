findMate.controller('EditMeetingController', ['$scope', '$http', 'editService', '$modalInstance', 'moment',
                     function($scope, 
                              $http,  
                              editService,
                              $modalInstance,
                              moment) {

  // working with api

  $scope.meetingId = editService.meetingId;
  $scope.logged_in_user = editService.user;

	$scope.$watch('editService.user', function () {
		 $scope.getUsers();
	});



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
                updated_at: new Date(),
                visibility: meeting.visibility
             }

        })
        .error(function (data) {
            console.log('Error: ' + data);
        });

						 $scope.loadFbFriends = function() {
							 var user = editService.user;
							 if(user.facebook){
								 var fbFriendsRequest = 'https://graph.facebook.com/' + user.facebook.id + '/friends' + '?access_token=' + user.facebook.token;
								 $http.get(fbFriendsRequest)
									 .success(function (data) {
										 var friends = data.data;
										 var users = $scope.users;
										 var userLength = users.length;
										 var friendsLength = friends.length;

										 for (var i = 0; i<userLength; i++){
											 var fbUser = users[i];
											 if(fbUser.facebook){
												 var id = fbUser.facebook.id;
												 for (var u = 0; u<friendsLength; u++){
													 var friend = friends[u];
													 if (id === friend.id){
														 fbUser.friend = "Facebook"
														 $scope.friendUsers.push(fbUser);
													 };
												 };
											 };
										 };
									 })
									 .error(function (data) {
										 console.log('Error: ' + data);
									 });
							 }


						 };

						 $scope.loadVkFriends = function() {
							 var user = editService.user;
							 if(user.vkontakte){
								 var vkfriendsRequest = 'https://api.vk.com/method/friends.get?user_id=' + user.vkontakte.id + '&callback=JSON_CALLBACK';
								 $http.jsonp(vkfriendsRequest)
									 .success(function (data) {
										 var friends = data.response;
										 var users = $scope.users;
										 var userLength = users.length;
										 var friendsLength = friends.length;

										 for (var i = 0; i<userLength; i++) {
											 var vkUser = users[i];
											 if (vkUser.vkontakte && vkUser.vkontakte.id != user.vkontakte.id) {
												 var id = vkUser.vkontakte.id;
												 for (var u = 0; u < friendsLength; u++) {
													 var friend = friends[u];
													 if (friend == id) {
														 vkUser.friend = "Вконтакте";
														 $scope.friendUsers.push(vkUser);
													 };
												 };
											 };
										 };
									 })
									 .error(function (data) {
										 console.log('Error: ' + data);
									 });
							 }

						 };

						 // deal with users service
						 $scope.getUsers = function(){
							 $http.get('../api/users')
								 .success(function(data) {
									 $scope.users = data;
									 console.log(data);
									 $scope.loadFbFriends();
									 $scope.loadVkFriends();

								 })
								 .error(function (data) {
									 console.log('Error: ' + data);
								 });
						 }

     

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
              })
              .error(function(data) {
                  console.log('Error: ', data);
              })
    };
}]);