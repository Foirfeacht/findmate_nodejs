findMate.controller('DialogController', ['$scope', '$http', 'mapService', 'moment', '$modalInstance',
                     function($scope, 
                              $http, 
                              mapService, 
                              dialogService,
                              $modalInstance,
                              moment) {


   $scope.loadFriends = function() {
     var user = mapService.user;
     var fbFriendsRequest = 'https://graph.facebook.com/' + user.facebook.id + '/friends' + '?access_token=' + user.facebook.token;
	 var vkfriendsRequest = 'https://api.vk.com/method/friends.get?user_id='.user.vkontakte.id;
		 if(user.facebook.id){
			 $http.get(fbFriendsRequest)
				 .success(function (data) {
					 $scope.friends = data.data;
					 var users = $scope.users;
					 var friends = $scope.friends;
					 var userLength = users.length;
					 var friendsLength = friends.length;
					 for (var i = 0; i<userLength; i++){
						 var user = users[i];
						 var fbId = user.facebook.id;
						 //var vkId = user.vkontakte.id;
						 for (var u = 0; u<friendsLength; u++){
							 var friend = friends[u];
							 if (fbId === friend.id){
								 $scope.friendUsers.push(user);
							 };
						 };
					 };
				 })
				 .error(function (data) {
					 console.log('Error: ' + data);
				 });
		 };
	   	if(user.vkontakte.id){
			$http.get(vkfriendsRequest)
				.success(function (data) {
					console.log(data);
					/*$scope.friends = data.data;
					var users = $scope.users;
					var friends = $scope.friends;
					var userLength = users.length;
					var friendsLength = friends.length;
					for (var i = 0; i<userLength; i++){
						var user = users[i];
						var fbId = user.facebook.id;
						//var vkId = user.vkontakte.id;
						for (var u = 0; u<friendsLength; u++){
							var friend = friends[u];
							if (fbId === friend.id){
								$scope.friendUsers.push(user);
							};
						};
					};*/
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
       $scope.loadFriends($scope.users);
    })
    .error(function (data) {
      console.log('Error: ' + data);
    });
  }

	 //init logged in user from service
	 $scope.$watch('mapService.user', function () {
		 $scope.getUsers();
	 });


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
  

   $scope.formData = {
    latLng: mapService.latLng,
    category: "Развлечения",
    visibility: "Общие",
    startDate:  new Date(),
    startTime: new Date(),
	invitedUsers: $scope.invitedUsers
  };

  

  // working with service
  $scope.latLng = mapService.latLng;

  $scope.formData.latitude = $scope.latLng.lat();
  $scope.formData.longitude = $scope.latLng.lng();

  $scope.formData.position = $scope.latLng.lat() + ', ' + $scope.latLng.lng();

  Date.prototype.timeNow = function () {
     return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
  };


  //geocoder

  var geocoder = new google.maps.Geocoder();

  function codeLatLng() {
        geocoder.geocode({'latLng': $scope.latLng, address: 'address', region: ', BY'}, function(results, status) {
                 if (status == google.maps.GeocoderStatus.OK) {
                      if (results[1]) {
                        $scope.formData.location = results[1].formatted_address;
                        console.log(results[1].formatted_address);
                      } else {
                        console.log('No results found');
                      }
                } else {
                     console.log('Geocoder failed due to: ' + status);
				}
         });
   };

  codeLatLng();


// working with api

  $http.get('../api/meetings')
        .success(function(data) {
            $scope.meetings = data;
            console.log(data);

        })
        .error(function (data) {
            console.log('Error: ' + data);
        });



  $scope.createMeeting = function() {
      $http.post('../api/meetings', $scope.formData)
              .success(function (data) {
                  console.log($scope.formData);
                  $scope.formData = {}; // clear the form so our user is ready to enter another
                  $scope.meetings = data;
                  console.log(data);
                  $scope.ok();
              })
              .error(function(data) {
                  console.log('Error: ' + data);
              })
    };

	 //datepicker
	 $scope.formData.startTime = new Date();

	 $scope.dateOptions = {
		 startingDay: 1,
     showWeeks: false,
	 };

   $scope.hstep = 1;
   $scope.mstep = 15;
   $scope.minDate = new Date();
   $scope.showMeridian = false;
   $scope.format = 'yyyy/MM/dd';

   $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

}]);

