// map controller
// public/map.js

findMate.controller('mapController', ['$scope', '$http', '$modal', function($scope, $http, $modal) {

    //load input data

    $scope.formData = {};

    //map

    $scope.latitude = null;
    $scope.longitude = null;

    $scope.markers = [];

    $scope.formData.marker = '';


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
            $scope.formData.latitude = event.latLng.lat();
            $scope.lat = $scope.formData.latitude;
            $scope.formData.longitude = event.latLng.lng();
            $scope.lng = $scope.formData.longitude;
            console.log($scope.formData.longitude);

            // get address from coords
            $scope.geocoder = new google.maps.Geocoder();

            $scope.latLng = new google.maps.LatLng($scope.formData.latitude, $scope.formData.longitude);

            $scope.codeLatLng = function() {
                $scope.geocoder.geocode({'latLng': $scope.latLng, address: 'address', region: ', BY'}, function(results, status) {
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

            $scope.codeLatLng();
        }); //end addListener

        

       


    // load map on WindowLoad

    $scope.$watch('$viewContentLoaded', function() {
        $scope.initialize();
    });

    // map methods, need revising

    $scope.setAllMap = function(map) {
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
    }

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
;

    $scope.completeMeeting = function(id){
        console.log('clicked');
        $http.put('/api/meetings/' + id)
            .success(function (data) {
                $scope.meetings = data;
                data.active = false;
                console.log('function active');
            })
            .error(function (data) {
                console.log('Error: ' + data);
            })
    }    

    $scope.showModal = function(id){
        console.log('clicked');
    }

    //modal
    $scope.open = function (size) {

        var modalInstance = $modal.open({
          templateUrl: 'myModalContent.html',
          controller: 'ModalInstanceCtrl',
          size: size
        });

        modalInstance.result.then(function (selectedItem) {
          $scope.selected = selectedItem;
        }, function () {
          console.log('Modal dismissed at: ' + new Date());
        });
      };   

      // datepicker
    $scope.datepickers = {
        startDate: false,
        endDate: false
    }
    $scope.today = function() {
       $scope.startDate = new Date();
       $scope.endDate = new Date();
    };
    $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();
    $scope.open = function($event, which) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.datepickers[which]= true;
      };

    $scope.clearSD = function () {
       $scope.startDate = null;
    };

    $scope.clearED = function () {
       $scope.endDate = null;
    };

    $scope.format = 'dd-MMMM-yyyy';
    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    // time picker
    $scope.hstep = 1;
    $scope.mstep = 1;
    $scope.ismeridian = false;
   
}]);