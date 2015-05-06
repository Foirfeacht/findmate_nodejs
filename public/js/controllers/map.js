// map controller
// public/map.js

findMate.controller('mapController', ['$scope', '$http', '$mdSidenav', '$modal', '$mdToast', '$animate', 'notificationService', 'toastr', '$sce',
	function ($scope, $http, $mdSidenav, $modal, $mdToast, $animate, notificationService, toastr, $sce) {

		$scope.getCurrentUser = function () {
			$http.get('/current_user')
				.success(function (data) {
					$scope.currentUser = data;
					console.log($scope.currentUser);
				})
				.error(function (data) {
					console.log('Error: ' + data);
				});
		};

		$scope.getCurrentUser();

		// decline invitation
		$scope.declineInvitation = function (id) {
			$http.put('/decline/meetings/' + id)
				.success(function (data) {
				})
				.error(function (data) {
					console.log('Error: ' + data);
				});
			$scope.getCurrentUser();
		};

		// join meeting
		$scope.joinMeeting = function (id) {
			$http.put('/join/meetings/' + id)
				.success(function (data) {
				})
				.error(function (data) {
					console.log('Error: ' + data);
				});
			$scope.getCurrentUser();

		};

		// unjoin meeting
		$scope.unjoinMeeting = function (id) {
			$http.put('/unjoin/meetings/' + id)
				.success(function (data) {
				})
				.error(function (data) {
					console.log('Error: ' + data);
				});
			$scope.getCurrentUser();
		};


		//load input data

		$scope.formData = {};

		//map

		//
		$scope.$on('mapInitialized', function (event, map) {
			$scope.defaultPos = new google.maps.LatLng(53.902407, 27.561621);
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function (position) {
					$scope.pos = new google.maps.LatLng(position.coords.latitude,
						position.coords.longitude);
					$scope.map.setCenter($scope.pos);
					console.log('positioned at ' + $scope.pos)
				}, function () {
					handleNoGeolocation(true);
				});
			} else {
				// Browser doesn't support Geolocation
				handleNoGeolocation(false);
			}

			function handleNoGeolocation(errorFlag) {
				if (errorFlag) {
					console.log('Error: The Geolocation service failed.');
				} else {
					console.log('Error: Your browser doesn\'t support geolocation.');
				}
			};
			$scope.map.setCenter($scope.pos || $scope.defaultPos);
			$scope.cursor = 'pointer'; 
			$scope.map.setOptions({ draggableCursor: $scope.cursor });

			$scope.$watch('cursor', function () {
				console.log($scope.cursor);
				$scope.map.setOptions({ draggableCursor: $scope.cursor });
			});

			google.maps.event.addListener($scope.map, "click", function (event) {
				$scope.latitude = event.latLng.lat();
				$scope.longitude = event.latLng.lng();
				console.log($scope.toggleCreate);
				// get address from coords
				$scope.geocoder = new google.maps.Geocoder();

				$scope.latLng = new google.maps.LatLng($scope.latitude, $scope.longitude);

				$scope.codeLatLng = function () {
					console.log($scope.latLng);
					$scope.geocoder.geocode({'latLng': $scope.latLng}, function (results, status) {
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
			var position = new google.maps.LatLng(meeting.latitude, meeting.longitude);
			var infowindow = new google.maps.InfoWindow();


			infowindow.setContent(
				'<h3>' + meeting.title + '</h3>' +
				'<p>' + meeting.description + '</p>' +
				'<p><strong>' + meeting.location + '</strong></p>'
			);

			infowindow.setPosition(position);
			infowindow.open($scope.map);
		};

		$scope.showInfobox = function (event, meeting) {
			console.log(meeting);
			var position = new google.maps.LatLng(meeting.latitude, meeting.longitude);

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

		//toggle add marker button
		$scope.toggleCreate = false;


		// when landing on the page, get all events and show them
		$http.get('../api/meetings')
			.success(function (data) {
				$scope.meetings = data;
				console.log(data);
			})
			.error(function (data) {
				console.log('Error: ' + data);
			});

		//refresh data with socket
		socket.on('meetings changed', function (data) {
			$scope.$apply(function () {
				$scope.meetings = data.msg;
			});
			console.log($scope.meetings);
		});

		socket.on('push notification added', function (data) {
			console.log(data.msg);

			if(data.msg._id === $scope.currentUser._id){
				$http.get('/current_user')
					.success(function (data) {
						$scope.currentUser = data;
						$scope.showNotification();
					})
					.error(function (data) {
						console.log('Error: ' + data);
					});
			}
		});

		$scope.redirectToMeeting = function (location) {
			window.location.href = "meetings/" + location;
		}

		//notification
		$scope.showNotification = function() {
			$scope.addedNotification = $scope.currentUser.notifications[$scope.currentUser.notifications.length - 1];
			console.log($scope.addedNotification);
			$scope.thisCanBeusedInsideNgBindHtml = $sce.trustAsHtml('<h1>' + $scope.addedNotification.meeting.title + '</h1>');
			/*$mdToast.show({
				controller: 'notificationController',
				templateUrl: './public/partials/invite-notification.ejs',
				hideDelay: 6000,
				position: 'bottom left',
				scope: $scope
			});*/
			toastr.info( 'У вас новое приглашение!',
					'<div ng-bind-html="thisCanBeusedInsideNgBindHtml"></div>', {
					allowHtml: true
					//onclick: $scope.redirectToMeeting($scope.addedNotification.meeting._id)
				});
		};

		$scope.deleteNotification = function(id){
			console.log(id);
			$http.put('/deleteNotification/users/' + $scope.currentUser._id + '/notifications/' + id)
				.success(function (data) {
				})
				.error(function (data) {
					console.log('Error: ' + data);
				});
		};

		socket.on('push notification removed', function (data) {
			$scope.currentUser = data.msg;
		};

		//notification service update
		$scope.$watch('addedNotification', function () {
			console.log($scope.addedNotification);
			notificationService.getNotification($scope.addedNotification);
		});

		$scope.$on('notificationUpdated', function () {
			$scope.addedNotification = notificationService.notification;
		});

		// ng show for buttons
		$scope.showButton = function (array) {
			var id = $scope.currentUser._id;
			var i, obj;
			for (i = 0; i < array.length; ++i) {
				obj = array[i];
				if (obj._id == id) {
					return true;
				};
			};
			return false;
		};

		// when submitting the add form, send the text to the node API
		$scope.createMeeting = function () {
			$http.post('../api/meetings', $scope.formData)
				.success(function (data) {
					console.log($scope.formData);
					$scope.meetings = data;
					console.log(data);
				})
				.error(function (data) {
					console.log('Error: ' + data);
				})
		};

		// delete a todo after checking it
		$scope.deleteMeeting = function (id) {
			$http.delete('../api/meetings/' + id)
				.success(function (data) {
					$scope.meetings = data;
					console.log(data);
				})
				.error(function (data) {
					console.log('Error: ' + data);
				});
		};
		//send notification
		socket.on('meeting added', function (data) {
			$scope.newMeeting = data.msg;
			console.log($scope.newMeeting);
			if($scope.newMeeting.owner === $scope.currentUser._id){

				console.log($scope.newMeeting);
				if($scope.newMeeting.invitedUsers.length > 0){
					$scope.sendInvitation($scope.newMeeting);
				}
			};
		});

		$scope.sendInvitation = function (meeting) {
			$http.put('/pushNotification/users/', meeting)
				.success(function (data) {

				})
				.error(function (data) {
					console.log('Error: ', data);
				})
		}

		// get function to refresh on modal closing

		$scope.refresh = function () {
			$http.get('../api/meetings')
				.success(function (data) {
					$scope.meetings = data;
					console.log(data);
				})
				.error(function (data) {
					console.log('Error: ' + data);
				});
		};

		$scope.showDialog = function (size) {	
			$scope.$modalInstance = $modal.open({
				templateUrl: './public/partials/dialog.tmpl.ejs',
				controller: 'DialogController',
				size: size,
				scope: $scope
			});
		};

		$scope.createMeeting = function(){
			if($scope.toggleCreate === true){
				$scope.showDialog('lg');
			}
		}

		$scope.ok = function () {
			$scope.$modalInstance.close();
		};

		$scope.cancel = function () {
			$scope.$modalInstance.dismiss('cancel');
		};

		// side nav
		$scope.toggleNav = function () {
			$mdSidenav('nav').toggle();
		};

		$scope.showMessageBox = false;

		$scope.zoom = 15;
		$scope.maxZoom = 16;
		$scope.minZoom = 12;
		
		$scope.toggleCreateEvent = function () {
			$scope.toggleCreate = ($scope.toggleCreate === false) ? true : false;
			console.log($scope.toggleCreate);
			if($scope.toggleCreate === true){
				$scope.cursor = 'crosshair';
				//$scope.cursor = 'url:(../public/images/marker.png), crosshair';
				console.log($scope.cursor);
			} else {
				$scope.cursor = 'pointer';
			}
		};

		$scope.disableCreateMode = function($event) {
			$event.preventDefault();
			$scope.toggleCreate = false;
			$scope.cursor = 'pointer';
		};

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
			],
			papuportal: [
    {
        "featureType": "all",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "saturation": 36
            },
            {
                "color": "#000000"
            },
            {
                "lightness": 40
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#000000"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 17
            },
            {
                "weight": 1.2
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#ed5929"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#c4c4c4"
            }
        ]
    },
    {
        "featureType": "administrative.neighborhood",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#ed5929"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 21
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "poi.business",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ed5929"
            },
            {
                "lightness": "0"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#ed5929"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 18
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#575757"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#2c2c2c"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#999999"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 19
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 17
            }
        ]
    }
]

		}


	}]);