// map controller
// public/map.js

findMate.controller('mapController', ['$scope', '$http', 'mapService', '$mdSidenav', '$mdDialog', function($scope, $http, mapService, $mdSidenav, $mdDialog) {

    //load input data

    $scope.formData = {};

    //map

    //$scope.map = mapService.map;

    $scope.markers = [];

    $scope.formData.marker = '';

    $scope.latLng = mapService.latLng;

    //$scope.getCoords = mapService.getCoords


    $scope.initialize = function () {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
              $scope.pos = new google.maps.LatLng(position.coords.latitude,
                                               position.coords.longitude);

              $scope.map.setCenter($scope.pos);
              console.log('positioned at ' + $scope.pos)
            }, function() {
              handleNoGeolocation(true);
            });
            } else {
            // Browser doesn't support Geolocation
            handleNoGeolocation(false);
            }
            }

            function handleNoGeolocation(errorFlag) {
            if (errorFlag) {
            consloe.log('Error: The Geolocation service failed.');
            } else {
            console.log('Error: Your browser doesn\'t support geolocation.');
            }

        };

        var mapOptions = {
          center: $scope.pos || new google.maps.LatLng(53.902216, 27.561839),
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        $scope.map = new google.maps.Map(document.getElementById("map_canvas"),
            mapOptions);

        google.maps.event.addListener($scope.map, "click", function (event) {
            //$scope.formData.latitude = event.latLng.lat();
            //$scope.lat = $scope.formData.latitude;
            //$scope.formData.longitude = event.latLng.lng();
            //$scope.lng = $scope.formData.longitude;
            //console.log($scope.formData.longitude);
            $scope.latitude = event.latLng.lat();
            $scope.longitude = event.latLng.lng();
            

            // get address from coords
            $scope.geocoder = new google.maps.Geocoder();

            $scope.latLng = new google.maps.LatLng($scope.latitude, $scope.longitude);
            console.log($scope.latLng);

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

        
    
       


    // load map on WindowLoad

    $scope.$watch('$viewContentLoaded', function() {
        $scope.initialize();
    });


    $scope.$watch('latLng', function() {
        mapService.getCoords($scope.latLng);
    });

    $scope.$on('valuesUpdated', function() {
        $scope.latLng = mapService.latLng;
    });
    // map methods, need revising

 /*   $scope.setAllMap = function(map) {
        map = $scope.map
        for (var i = 0; i < $scope.markers.length; i++) {
           $scope.markers[i].setMap(map);
        }
    }

    $scope.clearMarkers = function() {
      $scope.setAllMap(null);
    }

    $scope.deleteMarkers = function(){
        $scope.clearMarkers();
        $scope.markers = [];
    }*/

    // when landing on the page, get all events and show them
    $http.get('../api/meetings')
        .success(function(data) {
            $scope.meetings = data;
            console.log(data);

            // draw markers from database
            var l = data.length;
            for( var i = 0; i < l; i++) {
                var latLng = new google.maps.LatLng(data[i].latitude, data[i].longitude);
                var marker = new google.maps.Marker({
                    position: latLng,
                    map: $scope.map
                });
                $scope.markers.push(marker);

                console.log(data[i].location + '\n' + data[i].title + '\n' + data[i].description);


                var infoContent = '<div id="content">' + data[i].location + '<br>' + data[i].title + '<br>' + 
                                    data[i].description + '<md-button class="md-raised join-button" ng-click="joinMeeting(data[i]._id)">Учавствовать</md-button>' +'</div>';

                var infowindow = new google.maps.InfoWindow({
                  content: infoContent
                });

                google.maps.event.addListener(marker, 'click', function() {
                   infowindow.open($scope.map, marker);
                });
            }



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

                        // create marker
                        var marker = new google.maps.Marker({
                            position: $scope.latLng,
                            map: $scope.map,
                            title: $scope.formData.title
                        });

                        $scope.markers.push(marker);

                        var infoContent = '<div id="content">' + $scope.formData.location + '<br>' + $scope.formData.title + '<br>' + 
                                            $scope.formData.description + '<br>' + '</div>';

                        var infowindow = new google.maps.InfoWindow({
                          content: infoContent
                        });

                        google.maps.event.addListener(marker, 'click', function() {
                           infowindow.open($scope.map, marker);
                        });

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

                // draw markers from database
                var l = data.length;
                for( var i = 0; i < l; i++) {
                    var latLng = new google.maps.LatLng(data[i].latitude, data[i].longitude);
                    var marker = new google.maps.Marker({
                        position: latLng,
                        map: $scope.map
                    });
                    $scope.markers.push(marker);

                    console.log(data[i].location + '\n' + data[i].title + '\n' + data[i].description);


                    var infoContent = '<div id="content">' + data[i].location + '<br>' + data[i].title + '<br>' + 
                                        data[i].description + '</div>';

                    var infowindow = new google.maps.InfoWindow({
                      content: infoContent
                    });

                    google.maps.event.addListener(marker, 'click', function() {
                       infowindow.open($scope.map, marker);
                    });
                }
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    }   

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