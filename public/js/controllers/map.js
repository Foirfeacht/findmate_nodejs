// map controller
// public/map.js

findMate.controller('mapController', ['$scope', '$http', 'mapService', '$mdSidenav', '$mdDialog', 
					function($scope,
							 $http,
							 mapService, 
							 $mdSidenav, 
							 $mdDialog) {

    //load input data

    $scope.formData = {};

    //map


    $scope.markers = [];

    $scope.formData.marker = '';

    $scope.latLng = mapService.latLng;

    //$scope.getCoords = mapService.getCoords
    //
    $scope.$on('mapInitialized', function(event, map) {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
              $scope.pos = new google.maps.LatLng(position.coords.latitude,
                                               position.coords.longitude);

              map.setCenter($scope.pos);
              console.log('positioned at ' + $scope.pos)
            }, function() {
              handleNoGeolocation(true);
            });
        } else {
            // Browser doesn't support Geolocation
                handleNoGeolocation(false);
            }

            function handleNoGeolocation(errorFlag) {
                if (errorFlag) {
                    consloe.log('Error: The Geolocation service failed.');
                } else {
                    console.log('Error: Your browser doesn\'t support geolocation.');
                }
            };

        google.maps.event.addListener($scope.map, "click", function (event) {
            $scope.latitude = event.latLng.lat();
            $scope.longitude = event.latLng.lng();
            

            // get address from coords
            $scope.geocoder = new google.maps.Geocoder();

            $scope.latLng = new google.maps.LatLng($scope.latitude, $scope.longitude);

            $scope.codeLatLng = function() {
                $scope.geocoder.geocode({'latLng': $scope.latLng, address: 'address', region: ', BY'}, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                      if (results[1]) {
                        $scope.location = results[1].formatted_address;
                        console.log(results[1].formatted_address);
                      } else {
                        console.log('No results found');
                      }
                    } else {
                      console.log('Geocoder failed due to: ' + status);
                    }
                });
            }

            $scope.codeLatLng();
        }); //end addListener
    });


    $scope.$watch('latLng', function() {
        mapService.getCoords($scope.latLng);
    });

    $scope.$on('valuesUpdated', function() {
        $scope.latLng = mapService.latLng;
    });


    // when landing on the page, get all events and show them
    $http.get('../api/meetings')
        .success(function(data) {
            $scope.meetings = data;
            console.log(data);



        })
        .error(function (data) {
            console.log('Error: ' + data);
        });

    $scope.joinMeeting = function(id){

        $http.put('/join/meetings/' + id)
            .success(function (data) {
                $scope.meetings = data;
                //$scope.active = false;
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            })
    };



    // when submitting the add form, send the text to the node API
    $scope.createMeeting = function() {
        //if($scope.latitude && $scope.longitude){
            $http.post('../api/meetings', $scope.formData)
                    .success(function (data) {
                        console.log($scope.formData);

                        $scope.formData = {}; // clear the form so our user is ready to enter another
                        $scope.meetings = data;
                        console.log(data);
                    })
                    .error(function(data) {
                        console.log('Error: ' + data);
                    })
        //}
        //else {
        //    console.log('no coordinates provided')
        //}
    };

    // delete a todo after checking it
    $scope.deleteMeeting = function(id) {
        $http.delete('../api/meetings/' + id)
            .success(function (data) {
                $scope.meetings = data;
                console.log(data);
                $scope.deleteMarkers();
                var l = data.length;
                    for( var i = 0; i < l; i++) {
                        var latLng = new google.maps.LatLng(data[i].latitude, data[i].longitude);
                        var marker = new google.maps.Marker({
                            position: latLng,
                            map: $scope.map
                        });
                }
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    //update meeting
    $scope.updateMeeting = function (id) {
        // not implemented yet
    };

    // get function to refresh on modal closing

    $scope.refresh = function() {
        $http.get('../api/meetings')
            .success(function(data) {
                $scope.meetings = data;
                console.log(data);

            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    }

    $scope.showMine = false;


    // side nav
    $scope.toggleNav = function() {
       $mdSidenav('nav').toggle();
    };


    // md dialog
    $scope.showDialog = function(ev){
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: './public/partials/dialog.tmpl.ejs',
          targetEvent: ev
             }).then(function(data) {
                  $scope.refresh();
                  console.log('refreshed')
             }, function() {
                  $scope.refresh();
             })     
    }
}]);