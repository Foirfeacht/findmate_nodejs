// map controller
// public/map.js

findMate.controller('mapController', ['$scope', '$http', '$mdSidenav', '$modal', '$mdToast', '$animate', 'notificationService', 'toastr', '$sce',
	function ($scope, $http, $mdSidenav, $modal, $mdToast, $animate, notificationService, toastr, $sce) {


		$scope.friendUsers = [];

		// get userfriends
		$scope.loadFbFriends = function () {
			var user = $scope.currentUser;
			if (user.facebook) {
				var fbFriendsRequest = 'https://graph.facebook.com/' + user.facebook.id + '/friends' + '?access_token=' + user.facebook.token;
				$http.get(fbFriendsRequest)
					.success(function (data) {
						var friends = data.data;
						var friendsLength = friends.length;
						for (var i = 0; i < friendsLength; i++) {
							var friend = friends[i];
							$scope.friendUsers.push(friend);
						};
					})
					.error(function (data) {
						console.log('Error: ' + data);
					});
			};
		};

		$scope.loadVkFriends = function () {
			var user = $scope.currentUser;
			if (user.vkontakte) {
				var vkfriendsRequest = 'https://api.vk.com/method/friends.get?user_id=' + user.vkontakte.id + '&callback=JSON_CALLBACK';
				$http.jsonp(vkfriendsRequest)
					.success(function (data) {
						var friends = data.response;
						var friendsLength = friends.length;
						for (var i = 0; i < friendsLength; i++) {
							var friend = friends[i];
							$scope.friendUsers.push(friend);
						};
					})
					.error(function (data) {
						console.log('Error: ' + data);
					});
			};
		};

		$scope.getCurrentUser = function() {
			$http.get('/current_user')
				.success(function (data) {
					$scope.currentUser = data;
					console.log($scope.currentUser);
					$scope.userLoaded = true;
				})
				.error(function (data) {
					console.log('Error: ' + data);
				});
		};

		$scope.getUserAndFriends = function(){
			$http.get('/current_user')
				.success(function (data) {
					$scope.currentUser = data;
					console.log($scope.currentUser);
					$scope.loadVkFriends();
					$scope.loadFbFriends();
					$scope.userLoaded = true;
				})
				.error(function (data) {
					console.log('Error: ' + data);
				});
		};

		$http.get('../api/meetings')
			.success(function (data) {
				$scope.meetings = data;
				console.log(data);
				$scope.getUserAndFriends();
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

		//map
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
				};

				$scope.codeLatLng();
			}); //end addListener

            var infoboxOptions = {
                content: document.getElementById("infobox"),
                disableAutoPan: false,
                maxWidth: 150,
                pixelOffset: new google.maps.Size(-140, 0),
                zIndex: null,
                boxStyle: {
                   // background: "url('http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/examples/tipbox.gif') no-repeat",
                    opacity: 1,
                    width: "280px"
                },
                closeBoxMargin: "12px 4px 2px 2px",
                closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
                infoBoxClearance: new google.maps.Size(1, 1)
            };

            var infobox = new InfoBox(infoboxOptions);

            $scope.openInfoBox = function(event, meeting){
                var position = new google.maps.LatLng(meeting.latitude, meeting.longitude);
                $scope.infoboxMeeting = meeting;
				$scope.getMeetingDistance = function (meeting){
					var position = new google.maps.LatLng(meeting.latitude, meeting.longitude);
					var distance = google.maps.geometry.spherical.computeDistanceBetween($scope.pos, position);
					return (distance / 1000).toFixed(2);
				};
                infobox.setPosition(position);
                infobox.open($scope.map);
            }

		});

        $scope.getDistance = function(meeting){
            var position = new google.maps.LatLng(meeting.latitude, meeting.longitude);
            var distance = google.maps.geometry.spherical.computeDistanceBetween($scope.pos, position);
            return (distance / 1000).toFixed(2);
        }

		$scope.zoom = 15;
		$scope.maxZoom = 16;
		$scope.minZoom = 12;

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

		$scope.viewMode = "map";

		$scope.selectMode = function(mode){
			$scope.viewMode = mode;
		};

		//toggle add marker button
		$scope.toggleCreate = false;

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
		};

		//notification
		$scope.showNotification = function() {
			$scope.addedNotification = $scope.currentUser.notifications[$scope.currentUser.notifications.length - 1];
			console.log($scope.addedNotification);
			$scope.thisCanBeusedInsideNgBindHtml = $sce.trustAsHtml('<h1>' + $scope.addedNotification.meeting.title + '</h1>');
			toastr.info( 'У вас новое приглашение!',
					'<div ng-bind-html="thisCanBeusedInsideNgBindHtml"></div>', {
					allowHtml: true
					//onclick: $scope.redirectToMeeting($scope.addedNotification.meeting._id)
				});
		};

		$scope.deleteNotification = function(id){
			$http.put('/deleteNotification/users/' + $scope.currentUser._id + '/notifications/' + id)
				.success(function (data) {
				})
				.error(function (data) {
					console.log('Error: ' + data);
				});
		};

		socket.on('push notification removed', function (data) {
			$scope.currentUser = data.msg;
		});

		//notification service update
		$scope.$watch('addedNotification', function () {
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
		};

		// show dialog

		$scope.showDialog = function (size) {	
			$scope.$modalInstance = $modal.open({
				templateUrl: './public/partials/dialog.tmpl.ejs',
				controller: 'DialogController',
				size: size,
				scope: $scope
			});
			$scope.$modalInstance.result.then(function () {
		      $scope.toggleCreate = false;
		      $scope.cursor = 'pointer';
		    }, function () {
				$scope.toggleCreate = false;
				$scope.cursor = 'pointer';
		    })
		};

		$scope.createMeeting = function(){
			if($scope.toggleCreate === true){
				$scope.showDialog('lg');
			};
		};

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

		//top message box
		$scope.showMessageBox = false;

        // filter area
        $scope.showFilterArea = false;

		//search panel
		$scope.showSearchPanel = false;

		//toggle create mode
		$scope.toggleCreateEvent = function () {
			$scope.toggleCreate = ($scope.toggleCreate === false) ? true : false;
			console.log($scope.toggleCreate);
			if($scope.toggleCreate === true){
				$scope.cursor = 'url(../public/images/marker.ico), crosshair';
			} else {
				$scope.cursor = 'pointer';
			};
		};

		//exit create mode when pressing esc button
		$scope.disableCreateMode = function($event) {
			$event.preventDefault();
			$scope.toggleCreate = false;
			$scope.cursor = 'pointer';
		};

		//default filters
		$scope.filterByDistance = function (meeting) {
			var position = new google.maps.LatLng(meeting.latitude, meeting.longitude);
			if($scope.pos){
				var distance = google.maps.geometry.spherical.computeDistanceBetween($scope.pos, position);
			} else {
				var distance = google.maps.geometry.spherical.computeDistanceBetween($scope.defaultPos, position);
			};
			if (distance < $scope.currentUser.settings.distance){
				return true
			};
			return false;
		};

		$scope.filterByActive = function(meeting){
			var dateNow = new Date().toJSON();
			if (meeting.startDate > dateNow) {
				return true;
			};
			return false; 
		};

		//switchable filters
		$scope.toggleFeatured = false;
		$scope.toggleCurrentUserFilter = false;
		$scope.toggleFriendsFilter = false;
		$scope.toggleInvited = false;
		$scope.toggleJoined = false;

		$scope.filterCurrentUser = function(meeting){
			if($scope.toggleCurrentUserFilter === true){
				var userId = $scope.currentUser._id;
				if(meeting.owner._id === userId){
					return true
				};
				return false;
			}
			return true;
		};

		$scope.filterByFriends = function(meeting){
			if($scope.toggleFriendsFilter === true){
				var array = $scope.friendUsers;
				var arrayLength = $scope.friendUsers.length;

				for (var i = 0; i < arrayLength; ++i) {
					var obj = array[i];
                    if (meeting.owner.facebook && obj.id === meeting.owner.facebook.id){
                        return true;
                    }
                    if (meeting.owner.vkontakte && obj.id === meeting.owner.vkontakte.id){
                        return true;
                    }
					return false;
				};
			};
			return true;
		};

		$scope.filterInvited = function(meeting){
			if($scope.toggleInvited === true){
				var id = $scope.currentUser._id;
				var arrayLength = meeting.invitedUsers.length;

				for (var i = 0; i < arrayLength; ++i) {
					var obj = meeting.invitedUsers[i];
					console.log(obj);
					if (obj._id === id) {
						return true;
					};
				};
				return false;
			};
			return true;
		};

		$scope.filterJoined = function(meeting){
			if($scope.toggleJoined === true){
				var id = $scope.currentUser._id;
				var arrayLength = meeting.joinedUsers.length;

				for (var i = 0; i < arrayLength; ++i) {
					var obj = meeting.joinedUsers[i];
					if (obj._id === id) {
						return true;
					};
				};
				return false;
			};
			return true;
		};

        //query text filter
        $scope.search = function(meeting) {
            if($scope.searchQuery){
                var query = $scope.searchQuery.toLowerCase();
                var title = meeting.title.toLowerCase();
                var description = meeting.description.toLowerCase();
                var owner = meeting.owner.name.toLowerCase();
                if(title.indexOf(query) != -1 || description.indexOf(query) != -1 || owner.indexOf(query) != -1){
                    return true;
                }
                return false;
            }
           return true;
        }

		//category filters
		$scope.toggleSports = true;
		$scope.toggleOutdoor = true;
		$scope.toggleOpenair = true;
		$scope.toggleMovies = true;
		$scope.toggleExhibition = true;
		$scope.toggleTheater = true;
		$scope.toggleMusic = true;
		$scope.toggleFood = true;
		$scope.toggleParty = true;

		/*$scope.filterByCategory = function(category, meeting){
			if(meeting.category.value.en === category){
				return true;
			}
			return false;
		};*/

		$scope.filterByCategory = function(meeting){
			var categories = [];
			if($scope.toggleSports === true){
				categories.push('Sport');
			};
			if($scope.toggleOutdoor === true){
				categories.push('Outdoor');
			};
			if($scope.toggleOpenair === true){
				categories.push('Open Air Activity');
			};
			if($scope.toggleMovies === true){
				categories.push('Movies');
			};
			if($scope.toggleExhibition === true){
				categories.push('Exhibition');
			};
			if($scope.toggleTheater === true){
				categories.push('Theater');
			};
			if($scope.toggleMusic === true){
				categories.push('Music');
			};
			if($scope.toggleParty === true){
				categories.push('Party');
			};
			if($scope.toggleFood === true){
				categories.push('Restaurant/Cafe');
			};
			if(categories.length > 0){
				for(var i = 0; i < categories.length; i++){
					if(categories[i] === meeting.category.value.en){
						return true;
					};
				};
				return false;
			};
			return true;
		};


		$scope.mapStyles = {
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
							//"hue": "#ffcc00"
							"hue": "7B1FA2"
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
			],
			subtlegray: [
			    {
			        "featureType": "landscape",
			        "stylers": [
			            {
			                "saturation": -100
			            },
			            {
			                "lightness": 65
			            },
			            {
			                "visibility": "on"
			            }
			        ]
			    },
			    {
			        "featureType": "poi",
			        "stylers": [
			            {
			                "saturation": -100
			            },
			            {
			                "lightness": 51
			            },
			            {
			                "visibility": "simplified"
			            }
			        ]
			    },
			    {
			        "featureType": "road.highway",
			        "stylers": [
			            {
			                "saturation": -100
			            },
			            {
			                "visibility": "simplified"
			            }
			        ]
			    },
			    {
			        "featureType": "road.arterial",
			        "stylers": [
			            {
			                "saturation": -100
			            },
			            {
			                "lightness": 30
			            },
			            {
			                "visibility": "on"
			            }
			        ]
			    },
			    {
			        "featureType": "road.local",
			        "stylers": [
			            {
			                "saturation": -100
			            },
			            {
			                "lightness": 40
			            },
			            {
			                "visibility": "on"
			            }
			        ]
			    },
			    {
			        "featureType": "transit",
			        "stylers": [
			            {
			                "saturation": -100
			            },
			            {
			                "visibility": "simplified"
			            }
			        ]
			    },
			    {
			        "featureType": "administrative.province",
			        "stylers": [
			            {
			                "visibility": "off"
			            }
			        ]
			    },
			    {
			        "featureType": "water",
			        "elementType": "labels",
			        "stylers": [
			            {
			                "visibility": "on"
			            },
			            {
			                "lightness": -25
			            },
			            {
			                "saturation": -100
			            }
			        ]
			    },
			    {
			        "featureType": "water",
			        "elementType": "geometry",
			        "stylers": [
			            {
			                "hue": "#ffff00"
			            },
			            {
			                "lightness": -25
			            },
			            {
			                "saturation": -97
			            }
			        ]
			    }
			],
			paledawn: [
			    {
			        "featureType": "administrative",
			        "elementType": "all",
			        "stylers": [
			            {
			                "visibility": "on"
			            },
			            {
			                "lightness": 33
			            }
			        ]
			    },
			    {
			        "featureType": "landscape",
			        "elementType": "all",
			        "stylers": [
			            {
			                "color": "#f2e5d4"
			            }
			        ]
			    },
			    {
			        "featureType": "poi.park",
			        "elementType": "geometry",
			        "stylers": [
			            {
			                "color": "#c5dac6"
			            }
			        ]
			    },
			    {
			        "featureType": "poi.park",
			        "elementType": "labels",
			        "stylers": [
			            {
			                "visibility": "on"
			            },
			            {
			                "lightness": 20
			            }
			        ]
			    },
			    {
			        "featureType": "road",
			        "elementType": "all",
			        "stylers": [
			            {
			                "lightness": 20
			            }
			        ]
			    },
			    {
			        "featureType": "road.highway",
			        "elementType": "geometry",
			        "stylers": [
			            {
			                "color": "#c5c6c6"
			            }
			        ]
			    },
			    {
			        "featureType": "road.arterial",
			        "elementType": "geometry",
			        "stylers": [
			            {
			                "color": "#e4d7c6"
			            }
			        ]
			    },
			    {
			        "featureType": "road.local",
			        "elementType": "geometry",
			        "stylers": [
			            {
			                "color": "#fbfaf7"
			            }
			        ]
			    },
			    {
			        "featureType": "water",
			        "elementType": "all",
			        "stylers": [
			            {
			                "visibility": "on"
			            },
			            {
			                "color": "#acbcc9"
			            }
			        ]
			    }
			],
			bright: [
			    {
			        "featureType": "water",
			        "stylers": [
			            {
			                "color": "#19a0d8"
			            }
			        ]
			    },
			    {
			        "featureType": "administrative",
			        "elementType": "labels.text.stroke",
			        "stylers": [
			            {
			                "color": "#ffffff"
			            },
			            {
			                "weight": 6
			            }
			        ]
			    },
			    {
			        "featureType": "administrative",
			        "elementType": "labels.text.fill",
			        "stylers": [
			            {
			                "color": "#e85113"
			            }
			        ]
			    },
			    {
			        "featureType": "road.highway",
			        "elementType": "geometry.stroke",
			        "stylers": [
			            {
			                "color": "#FFEA00"
			            },
			            {
			                "lightness": -40
			            }
			        ]
			    },
			    {
			        "featureType": "road.arterial",
			        "elementType": "geometry.stroke",
			        "stylers": [
			            {
			                "color": "#efe9e4"
			            },
			            {
			                "lightness": -20
			            }
			        ]
			    },
			    {
			        "featureType": "road",
			        "elementType": "labels.text.stroke",
			        "stylers": [
			            {
			                "lightness": 100
			            }
			        ]
			    },
			    {
			        "featureType": "road",
			        "elementType": "labels.text.fill",
			        "stylers": [
			            {
			                "lightness": -100
			            }
			        ]
			    },
			    {
			        "featureType": "road.highway",
			        "elementType": "labels.icon"
			    },
			    {
			        "featureType": "landscape",
			        "elementType": "labels",
			        "stylers": [
			            {
			                "visibility": "off"
			            }
			        ]
			    },
			    {
			        "featureType": "landscape",
			        "stylers": [
			            {
			                "lightness": 20
			            },
			            {
			                "color": "#efe9e4"
			            }
			        ]
			    },
			    {
			        "featureType": "landscape.man_made",
			        "stylers": [
			            {
			                "visibility": "off"
			            }
			        ]
			    },
			    {
			        "featureType": "water",
			        "elementType": "labels.text.stroke",
			        "stylers": [
			            {
			                "lightness": 100
			            }
			        ]
			    },
			    {
			        "featureType": "water",
			        "elementType": "labels.text.fill",
			        "stylers": [
			            {
			                "lightness": -100
			            }
			        ]
			    },
			    {
			        "featureType": "poi",
			        "elementType": "labels.text.fill",
			        "stylers": [
			            {
			                "hue": "#11ff00"
			            }
			        ]
			    },
			    {
			        "featureType": "poi",
			        "elementType": "labels.text.stroke",
			        "stylers": [
			            {
			                "lightness": 100
			            }
			        ]
			    },
			    {
			        "featureType": "poi",
			        "elementType": "labels.icon",
			        "stylers": [
			            {
			                "hue": "#4cff00"
			            },
			            {
			                "saturation": 58
			            }
			        ]
			    },
			    {
			        "featureType": "poi",
			        "elementType": "geometry",
			        "stylers": [
			            {
			                "visibility": "on"
			            },
			            {
			                "color": "#f0e4d3"
			            }
			        ]
			    },
			    {
			        "featureType": "road.highway",
			        "elementType": "geometry.fill",
			        "stylers": [
			            {
			                "color": "#EBD700"
			            },
			            {
			                "lightness": -25
			            }
			        ]
			    },
			    {
			        "featureType": "road.arterial",
			        "elementType": "geometry.fill",
			        "stylers": [
			            {
			                "color": "#FFE92C"
			            },
			            {
			                "lightness": -10
			            }
			        ]
			    },
			    {
			        "featureType": "poi",
			        "elementType": "labels",
			        "stylers": [
			            {
			                "visibility": "simplified"
			            }
			        ]
			    }
			]

		}


	}]);