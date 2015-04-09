findMate.controller('DialogController', ['$scope', '$http', 'mapService', '$mdDialog', 'moment',
                     function($scope, 
                              $http, 
                              mapService, 
                              dialogService,
                              $mdDialog,
                              moment) {


  // deal with users service
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

     //init logged in user from service
    $scope.$watch('mapService.user', function () {
      $scope.loadFriends(mapService.user);
      
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
    startTime: new Date()
	//invitedUsers: $scope.invitedUsers
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

  $scope.hide = function() {
    $mdDialog.hide();
  };

  $scope.cancel = function() {
    $mdDialog.cancel();
  };

  // date and timepickers
            //timepicker
              $scope.formData.startTime = new Date();

              $scope.hstep = 1;
              $scope.mstep = 15;
              $scope.ismeridian = true;

              //datepicker
              $scope.formData.startTime = new Date();
              $scope.minDate = new Date();
               $scope.openDatePicker = function($event) {
                  $event.preventDefault();
                  $event.stopPropagation();

                  $scope.opened = true;
                };

          

                $scope.dateOptions = {
                  formatYear: 'yy',
                  startingDay: 1
                };

                $scope.format = 'yyyy/MM/dd';


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
			      $scope.sendInvites();

			  $mdDialog.hide();
              })
              .error(function(data) {
                  console.log('Error: ' + data);
              })
    };
}]);

$scope.sendInvites = function(){
	var invited = $scope.invitedUsers;
	var invitedLength = invited.length;

	console.log(invited);

	for(var i = 0; i < invitedLength; i++){
		var user = invited[i];
		var id = user._id;
		$http.put('/invite/' + id)
			.success(function (data) {
				$scope.users = data;
				console.log(data);

			})
			.error(function (data) {
				console.log('Error: ' + data);
			})
	}

}