findMate.controller('DialogController', ['$scope', '$http', 'moment', '$modalInstance',
	function ($scope, $http, $modalInstance) {

		$scope.loadFbFriends = function () {
			var user = $scope.currentUser;
			if (user.facebook) {
				var fbFriendsRequest = 'https://graph.facebook.com/' + user.facebook.id + '/friends' + '?access_token=' + user.facebook.token;
				$http.get(fbFriendsRequest)
					.success(function (data) {
						var friends = data.data;
						var users = $scope.users;
						var userLength = users.length;
						var friendsLength = friends.length;

						for (var i = 0; i < userLength; i++) {
							var fbUser = users[i];
							if (fbUser.facebook) {
								var id = fbUser.facebook.id;
								for (var u = 0; u < friendsLength; u++) {
									var friend = friends[u];
									if (id === friend.id) {
										fbUser.friend = "Facebook"
										$scope.friendUsers.push(fbUser);
									};
								};
							};
						};
					})
					.error(function (data) {
						console.log('Error: ' + data);
					});
			}
			;
		};

		$scope.loadVkFriends = function () {
			var user = $scope.currentUser;
			if (user.vkontakte) {
				var vkfriendsRequest = 'https://api.vk.com/method/friends.get?user_id=' + user.vkontakte.id + '&callback=JSON_CALLBACK';
				$http.jsonp(vkfriendsRequest)
					.success(function (data) {
						var friends = data.response;
						var users = $scope.users;
						var userLength = users.length;
						var friendsLength = friends.length;

						for (var i = 0; i < userLength; i++) {
							var vkUser = users[i];
							if (vkUser.vkontakte && vkUser.vkontakte.id != user.vkontakte.id) {
								var id = vkUser.vkontakte.id;
								for (var u = 0; u < friendsLength; u++) {
									var friend = friends[u];
									if (friend == id) {
										vkUser.friend = "Вконтакте";
										$scope.friendUsers.push(vkUser);
									};
								};
							};
						};
					})
					.error(function (data) {
						console.log('Error: ' + data);
					});
			};
		};

		// deal with users service
		$scope.getUsers = function () {
			$http.get('../api/users')
				.success(function (data) {
					$scope.users = data;
					console.log(data);
					$scope.loadFbFriends();
					$scope.loadVkFriends();
				})
				.error(function (data) {
					console.log('Error: ' + data);
				});
		};

		$scope.getUsers();


		$scope.friendUsers = [];
		$scope.invitedUsers = [];
		$scope.invitedUsersSettings = {
			scrollableHeight: '200px',
			scrollable: true,
			enableSearch: true,
			displayProp: 'name',
			idProp: '_id',
			externalIdProp: '',
			groupByTextProvider: function (groupValue) {
				if (groupValue === 'Facebook') {
					return 'Facebook';
				} else {
					return 'Вконтакте';
				};
			}
		};

		$scope.invitedUsersText = {
			buttonDefaultText: 'Пригласить друзей'
		};


		$scope.formData = {
			latLng: $scope.latLng,
			visibility: 'all',
			startDate: new Date(),
			startTime: new Date(),
			invitedUsers: $scope.invitedUsers,
			latitude: $scope.latLng.lat(),
			longitude: $scope.latLng.lng(),
			position: $scope.latLng.lat() + ', ' + $scope.latLng.lng(),
			location: $scope.location,
			category: 'Sport'
		};

		//$scope.initCategory = "entertainment";

		$scope.defineCategory = function (category) {
			if (category === 'Outdoor') {
				$scope.formData.category = {
					value: {
						ru: 'Развлечения',
						en: 'Outdoor'
					},
					icon: 'outdoor'
				};
			};
			if (category === 'Sport') {
				$scope.formData.category = {
					value: {
						ru: 'Спорт',
						en: 'Sport'
					},
					icon: 'sport'
				};
			};
			if (category === 'Party') {
				$scope.formData.category = {
					value: {
						ru: 'Вечеринка',
						en: 'Party'
					},
					icon: 'party'
				};
			};
			if (category === 'Movies') {
				$scope.formData.category = {
					value: {
						ru: 'Кино',
						en: 'Movies'
					},
					icon: 'cinema'
				};
			};
			if (category === 'Exhibition') {
				$scope.formData.category = {
					value: {
						ru: 'Выставка',
						en: 'Exhibition'
					},
					icon: 'exhibition'
				};
			};
			if (category === 'Music') {
				$scope.formData.category = {
					value: {
						ru: 'Музыка',
						en: 'Music'
					},
					icon: 'music'
				};
			};
			if (category === 'Theater') {
				$scope.formData.category = {
					value: {
						ru: 'Театр',
						en: 'Theater'
					},
					icon: 'theater'
				};
			};
			if (category === 'Open Air Activity') {
				$scope.formData.category = {
					value: {
						ru: 'Мероприятие на открытом воздухе',
						en: 'Open Air Activity'
					},
					icon: 'openair'
				};
			};
			if (category === 'Restaurant/Cafe') {
				$scope.formData.category = {
					value: {
						ru: 'Ресторан/Кафе',
						en: 'Restaurant/Cafe'
					},
					icon: 'food'
				};
			};
		};


		$scope.categories = {
			"Sport": {
				value: {
					ru: 'Спорт',
					en: 'Sport'
				},
				icon: 'sport'
			},
			"Outdoor": {
				value: {
					ru: 'Активный отдых',
					en: 'Outdoor'
				},
				icon: 'outdoor'
			},
			"Party": {
				value: {
					ru: 'Вечеринка',
					en: 'Party'
				},
				icon: 'party'
			},
			"Movies": {
				value: {
					ru: 'Кино',
					en: 'Movies'
				},
				icon: 'cinema'
			},
			"Exhibition": {
				value: {
					ru: 'Выставка',
					en: 'Exhibition'
				},
				icon: 'exhibition'
			},
			"Music": {
				value: {
					ru: 'Музыка',
					en: 'Music'
				},
				icon: 'music'
			},
			"Theater": {
				value: {
					ru: 'Театр',
					en: 'Theater'
				},
				icon: 'theater'
			},
			"Open Air": {
				value: {
					ru: 'Мероприятие на открытом воздухе',
					en: 'Open Air Activity'
				},
				icon: 'openair'
			},
			"Restaurant/Cafe": {
				value: {
					ru: 'Ресторан/Кафе',
					en: 'Restaurant/Cafe'
				},
				icon: 'food'
			}
		};

		Date.prototype.timeNow = function () {
			return ((this.getHours() < 10) ? "0" : "") + this.getHours() + ":" + ((this.getMinutes() < 10) ? "0" : "") + this.getMinutes() + ":" + ((this.getSeconds() < 10) ? "0" : "") + this.getSeconds();
		};


		//geocoder

		var geocoder = new google.maps.Geocoder();

		function codeLatLng() {
			geocoder.geocode({'latLng': $scope.latLng}, function (results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					if (results[0]) {
						$scope.formData.location = results[0].formatted_address;
						console.log(results);
					} else {
						console.log('No results found');
					}
				} else {
					console.log('Geocoder failed due to: ' + status);
				}
			});
		};

		codeLatLng();


// working with api

		$http.get('../api/meetings')
			.success(function (data) {
				$scope.meetings = data;
				console.log(data);

			})
			.error(function (data) {
				console.log('Error: ' + data);
			});

		$scope.createMeeting = function () {
			$scope.defineCategory($scope.formData.category);
			$http.post('../api/meetings', $scope.formData)
				.success(function (data) {
					$scope.formData = {}; // clear the form so our user is ready to enter another
					console.log(data);
					$scope.ok();
				})
				.error(function (data) {
					console.log('Error: ' + data);
				})
		};

		//datepicker
		$scope.formData.startTime = new Date();

		$scope.dateOptions = {
			startingDay: 1,
			showWeeks: false,
		};

		$scope.hstep = 1;
		$scope.mstep = 15;
		$scope.minDate = new Date();
		$scope.showMeridian = false;
		$scope.format = 'yyyy/MM/dd';


	}]);

