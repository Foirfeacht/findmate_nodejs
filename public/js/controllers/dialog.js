findMate.controller('DialogController', ['$scope', '$http', 'mapService', '$mdDialog', function($scope, $http, mapService, $mdDialog) {

  $scope.hide = function() {
    $mdDialog.hide();
  };


  $scope.formData = {};

  // working with service
  $scope.latLng = mapService.latLng;

  $scope.formData.latitude = $scope.latLng.lat();
  $scope.formData.longitude = $scope.latLng.lng();

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