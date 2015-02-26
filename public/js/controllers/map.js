// map controller
// public/map.js

findMate.controller('mapController', ['$scope', '$http', '$modal', function($scope, $http, $modal) {

    //load input data

    $scope.formData = {};

    //map

    $scope.latitude = null;
    $scope.longitude = null;

    $scope.markers = [];


    $scope.initialize = function () {
        var mapOptions = {
          center: new google.maps.LatLng(53.902216, 27.561839),
          zoom: 13,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        $scope.map = new google.maps.Map(document.getElementById("map_canvas"),
            mapOptions);

        google.maps.event.addListener($scope.map, "click", function (event) {
            $scope.formData.latitude = event.latLng.lat();
            $scope.formData.longitude = event.latLng.lng();
            console.log($scope.formData.longitude);
        }); //end addListener

    };

    // load map on WindowLoad

    $scope.$watch('$viewContentLoaded', function() {
        $scope.initialize();
    });

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
                console.log($scope.markers);
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
                        var latLng = new google.maps.LatLng($scope.formData.latitude, $scope.formData.longitude);
                        console.log(latLng)
                        var marker = new google.maps.Marker({
                            position: latLng,
                            map: $scope.map,
                            title: $scope.formData.title
                        });

                        var infoContent = '<div id="content">' + $scope.formData.title + '<br>' + $scope.formData.description + '</div>';

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
   
}]);