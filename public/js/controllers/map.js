// map controller
// public/map.js

findMate.controller('mapController', ['$scope', '$http', '$mdSidenav', '$modal',
	function($scope, $http, $mdSidenav, $modal) {

    $http.get('/current_user')
        .success(function(data) {
            $scope.currentUser = data;
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });

    //load input data

    $scope.formData = {};

    //map

    $scope.markers = [];

    $scope.formData.marker = '';

    //
    $scope.$on('mapInitialized', function(event, map) {
    	$scope.pos = null;
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
              $scope.pos = new google.maps.LatLng(position.coords.latitude,
                                               position.coords.longitude);
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
        $scope.map.setCenter($scope.pos || 53.902407, 27.561621);

        google.maps.event.addListener($scope.map, "click", function (event) {
            $scope.latitude = event.latLng.lat();
            $scope.longitude = event.latLng.lng();
            

            // get address from coords
            $scope.geocoder = new google.maps.Geocoder();

            $scope.latLng = new google.maps.LatLng($scope.latitude, $scope.longitude);

            $scope.codeLatLng = function() {
				console.log($scope.latLng);
                $scope.geocoder.geocode({'latLng': $scope.latLng}, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                      if (results[0]) {
                        $scope.location = results[0].formatted_address;
                        console.log(results[0].formatted_address);
						  console.log(results);
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

		$scope.showInfoWindow = function (event, meeting) {
			console.log(meeting);
			var position = new google.maps.LatLng(meeting.latitude,meeting.longitude);
			var infowindow = new google.maps.InfoWindow();
			

			infowindow.setContent(
				'<h3>' + meeting.title + '</h3>' +
				'<p>' + meeting.description +  '</p>' +
				'<p><strong>' + meeting.location +  '</strong></p>'
			);

			infowindow.setPosition(position);
			infowindow.open($scope.map);
		};

		$scope.showInfobox = function (event, meeting) {
			console.log(meeting);
			var position = new google.maps.LatLng(meeting.latitude,meeting.longitude);
			
			var infobox = new InfoBox({
		         content: '<h3>' + meeting.title + '</h3>',
		         disableAutoPan: false,
		         maxWidth: 150,
		         pixelOffset: new google.maps.Size(-140, 0),
		         zIndex: null,
		         boxStyle: {
		            background: "url('http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/examples/tipbox.gif') no-repeat",
		            opacity: 0.75,
		            width: "280px"
		        },
		        closeBoxMargin: "12px 4px 2px 2px",
		        closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
		        infoBoxClearance: new google.maps.Size(1, 1)
		    });
		    infobox.open($scope.map, this)
		};

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
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            })
    };

    // when submitting the add form, send the text to the node API
    $scope.createMeeting = function() {
        $http.post('../api/meetings', $scope.formData)
                .success(function (data) {
                    console.log($scope.formData);
                    $scope.meetings = data;
                    console.log(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                })
    };

    // delete a todo after checking it
    $scope.deleteMeeting = function(id) {
        $http.delete('../api/meetings/' + id)
            .success(function (data) {
                $scope.meetings = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
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

    $scope.showDialog = function(size){
		$scope.$modalInstance = $modal.open({
          templateUrl: './public/partials/dialog.tmpl.ejs',
          controller: 'DialogController',
          size: size,
          scope: $scope
        });
		$scope.$modalInstance.result.then(function(data) {
                  $scope.refresh();
                  console.log('refreshed')
             }, function() {
                  $scope.refresh();
             });      
    };

		$scope.ok = function() {
			$scope.$modalInstance.close();
		};

		$scope.cancel = function() {
			$scope.$modalInstance.dismiss('cancel');
		};

    // side nav
    $scope.toggleNav = function() {
       $mdSidenav('nav').toggle();
    };

		$scope.zoom = 15;
		$scope.maxZoom = 16;
		$scope.minZoom = 12;

		$scope.mapStyles = {
			mapbox: [
				{
					"featureType": "water",
					"stylers": [
						{
							"saturation": 43
						},
						{
							"lightness": -11
						},
						{
							"hue": "#0088ff"
						}
					]
				},
				{
					"featureType": "road",
					"elementType": "geometry.fill",
					"stylers": [
						{
							"hue": "#ff0000"
						},
						{
							"saturation": -100
						},
						{
							"lightness": 99
						}
					]
				},
				{
					"featureType": "road",
					"elementType": "geometry.stroke",
					"stylers": [
						{
							"color": "#808080"
						},
						{
							"lightness": 54
						}
					]
				},
				{
					"featureType": "landscape.man_made",
					"elementType": "geometry.fill",
					"stylers": [
						{
							"color": "#ece2d9"
						}
					]
				},
				{
					"featureType": "poi.park",
					"elementType": "geometry.fill",
					"stylers": [
						{
							"color": "#ccdca1"
						}
					]
				},
				{
					"featureType": "road",
					"elementType": "labels.text.fill",
					"stylers": [
						{
							"color": "#767676"
						}
					]
				},
				{
					"featureType": "road",
					"elementType": "labels.text.stroke",
					"stylers": [
						{
							"color": "#ffffff"
						}
					]
				},
				{
					"featureType": "poi",
					"stylers": [
						{
							"visibility": "off"
						}
					]
				},
				{
					"featureType": "landscape.natural",
					"elementType": "geometry.fill",
					"stylers": [
						{
							"visibility": "on"
						},
						{
							"color": "#b8cb93"
						}
					]
				},
				{
					"featureType": "poi.park",
					"stylers": [
						{
							"visibility": "on"
						}
					]
				},
				{
					"featureType": "poi.sports_complex",
					"stylers": [
						{
							"visibility": "on"
						}
					]
				},
				{
					"featureType": "poi.medical",
					"stylers": [
						{
							"visibility": "on"
						}
					]
				},
				{
					"featureType": "poi.business",
					"stylers": [
						{
							"visibility": "simplified"
						}
					]
				}
			],
			bluewater: [
				{
					"featureType": "administrative",
					"elementType": "labels.text.fill",
					"stylers": [
						{
							"color": "#444444"
						}
					]
				},
				{
					"featureType": "landscape",
					"elementType": "all",
					"stylers": [
						{
							"color": "#f2f2f2"
						}
					]
				},
				{
					"featureType": "poi",
					"elementType": "all",
					"stylers": [
						{
							"visibility": "off"
						}
					]
				},
				{
					"featureType": "road",
					"elementType": "all",
					"stylers": [
						{
							"saturation": -100
						},
						{
							"lightness": 45
						}
					]
				},
				{
					"featureType": "road.highway",
					"elementType": "all",
					"stylers": [
						{
							"visibility": "simplified"
						}
					]
				},
				{
					"featureType": "road.arterial",
					"elementType": "labels.icon",
					"stylers": [
						{
							"visibility": "off"
						}
					]
				},
				{
					"featureType": "transit",
					"elementType": "all",
					"stylers": [
						{
							"visibility": "off"
						}
					]
				},
				{
					"featureType": "water",
					"elementType": "all",
					"stylers": [
						{
							"color": "#46bcec"
						},
						{
							"visibility": "on"
						}
					]
				}
			],
			flatmap: [
				{
					"featureType": "water",
					"elementType": "all",
					"stylers": [
						{
							"hue": "#7fc8ed"
						},
						{
							"saturation": 55
						},
						{
							"lightness": -6
						},
						{
							"visibility": "on"
						}
					]
				},
				{
					"featureType": "water",
					"elementType": "labels",
					"stylers": [
						{
							"hue": "#7fc8ed"
						},
						{
							"saturation": 55
						},
						{
							"lightness": -6
						},
						{
							"visibility": "off"
						}
					]
				},
				{
					"featureType": "poi.park",
					"elementType": "geometry",
					"stylers": [
						{
							"hue": "#83cead"
						},
						{
							"saturation": 1
						},
						{
							"lightness": -15
						},
						{
							"visibility": "on"
						}
					]
				},
				{
					"featureType": "landscape",
					"elementType": "geometry",
					"stylers": [
						{
							"hue": "#f3f4f4"
						},
						{
							"saturation": -84
						},
						{
							"lightness": 59
						},
						{
							"visibility": "on"
						}
					]
				},
				{
					"featureType": "landscape",
					"elementType": "labels",
					"stylers": [
						{
							"hue": "#ffffff"
						},
						{
							"saturation": -100
						},
						{
							"lightness": 100
						},
						{
							"visibility": "off"
						}
					]
				},
				{
					"featureType": "road",
					"elementType": "geometry",
					"stylers": [
						{
							"hue": "#ffffff"
						},
						{
							"saturation": -100
						},
						{
							"lightness": 100
						},
						{
							"visibility": "on"
						}
					]
				},
				{
					"featureType": "road",
					"elementType": "labels",
					"stylers": [
						{
							"hue": "#bbbbbb"
						},
						{
							"saturation": -100
						},
						{
							"lightness": 26
						},
						{
							"visibility": "on"
						}
					]
				},
				{
					"featureType": "road.arterial",
					"elementType": "geometry",
					"stylers": [
						{
							"hue": "#ffcc00"
						},
						{
							"saturation": 100
						},
						{
							"lightness": -35
						},
						{
							"visibility": "simplified"
						}
					]
				},
				{
					"featureType": "road.highway",
					"elementType": "geometry",
					"stylers": [
						{
							"hue": "#ffcc00"
						},
						{
							"saturation": 100
						},
						{
							"lightness": -22
						},
						{
							"visibility": "on"
						}
					]
				},
				{
					"featureType": "poi.school",
					"elementType": "all",
					"stylers": [
						{
							"hue": "#d7e4e4"
						},
						{
							"saturation": -60
						},
						{
							"lightness": 23
						},
						{
							"visibility": "on"
						}
					]
				}
			]

		}


    
}]);