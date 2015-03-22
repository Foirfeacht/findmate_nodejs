// map controller
// public/map.js

findMate.controller('mapBoxController', ['$scope', '$http', 'mapService', '$mdSidenav', '$mdDialog', function($scope, $http, mapService, $mdSidenav, $mdDialog) {

    //load input data

    L.mapbox.accessToken = 'pk.eyJ1IjoiYnVybmluZyIsImEiOiJBSUt1Z1JvIn0.B9XLW7EfsPIFuYlWbBCOaw';
    
    $scope.map = L.mapbox.map('map', 'examples.map-4l7djmvo', {
        center: [53.902216, 27.561839],
        zoom: 15 
    });



    $scope.formData = {};

    //map

    //$scope.map = mapService.map;

    $scope.markers = [];

    $scope.formData.marker = '';

    $scope.latLng = mapService.latLng;

   


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