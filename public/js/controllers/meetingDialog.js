findMate.controller('DialogController', ['$scope', '$http', 'routingService', '$mdDialog', function($scope, $http, routingService, $mdDialog) {

  $scope.hide = function() {
    $mdDialog.hide();
  };


  $scope.formData = {};

  // working with service
  $scope.latLng = mapService.latLng;

  $scope.formData.latitude = $scope.latLng.lat();
  $scope.formData.longitude = $scope.latLng.lng();

  $scope.formData.category = "Спорт";
  $scope.formData.visibility = "all";

  $scope.formData.startDate = new Date();

  Date.prototype.timeNow = function () {
     return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
  }

  $scope.formData.startTime = new Date().timeNow();

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

                        //draw marker

                        var marker = new google.maps.Marker({
                            position: $scope.latLng,
                            map: mapService.map,
                            title: $scope.formData.title
                        });

                        //$scope.markers.push(marker);

                        var infoContent = '<div id="content">' + $scope.formData.location + '<br>' + $scope.formData.title + '<br>' + 
                                            $scope.formData.description + '</div>';

                        var infowindow = new google.maps.InfoWindow({
                          content: infoContent
                        });

                        google.maps.event.addListener(marker, 'click', function() {
                           infowindow.open($scope.map, marker);
                        });

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