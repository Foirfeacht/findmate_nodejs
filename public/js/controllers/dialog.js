findMate.controller('DialogController', ['$scope', '$http', 'mapService', '$mdDialog', 'moment', 'dialogService',
                     function($scope, 
                              $http, 
                              mapService, 
                              dialogService,
                              $mdDialog,
                              moment) {

  $scope.hide = function() {
    $mdDialog.hide();
  };

  $scope.users = dialogService.users;
  console.log(dialogService.users);



   $scope.formData = {
    latLng: mapService.latLng,
    category: "Спорт",
    visibility: "all",
    startDate: new Date()
    //startTime: new Date().timeNow()
  };

  $scope.invitedUsers = [];
  $scope.invitedUsersSettings = {
    scrollableHeight: '100px',
    scrollable: true,
    enableSearch: true
  }

  // working with service
  $scope.latLng = mapService.latLng;

  $scope.formData.latitude = $scope.latLng.lat();
  $scope.formData.longitude = $scope.latLng.lng();

  $scope.formData.position = $scope.latLng.lat() + ', ' + $scope.latLng.lng();

  //$scope.formData.category = "Спорт";
  //$scope.formData.visibility = "all";

  //$scope.formData.startDate = Date.now();

  Date.prototype.timeNow = function () {
     return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
  }

  //$scope.formData.startTime = new Date().timeNow();


  $scope.formData.invitedUsers = $scope.invitedUsers;



  $scope.inviteUser = function(user){
    var index = invitedUsers.indexOf(user);
    console.log(index);
    if(index < 0){
    	invitedUsers.push(user);
    } else {
      invitedUsers.splice(index, 1);
    }

    console.log(invitedUsers);
  }

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
            }

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

   $http.get('../api/users')
        .success(function(data) {
            $scope.users = data;
		   $scope.userlist = $scope.users;
            console.log(data);
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });

  $scope.createMeeting = function() {
        //if($scope.latitude && $scope.longitude){
            $http.post('../api/meetings', $scope.formData)
                    .success(function (data) {
                        console.log($scope.formData);

                        $scope.formData = {}; // clear the form so our user is ready to enter another
                        $scope.meetings = data;
                        console.log(data);

                        
                        $mdDialog.hide();
                    })
                    .error(function(data) {
                        console.log('Error: ' + data);
                    })
        //}
        //else {
        //    console.log('no coordinates provided')
        //}
    };
}]);