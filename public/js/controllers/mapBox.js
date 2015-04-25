// map controller
// public/map.js

findMate.controller('mapBoxController', ['$scope', '$http', '$mdSidenav', '$modal',
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

			$scope.formData.marker = '';

			//map

			// when landing on the page, get all events and show them
			$http.get('../api/meetings')
				.success(function(data) {
					$scope.meetings = data;
					console.log(data);
					
				})
				.error(function (data) {
					console.log('Error: ' + data);
				});

			/*
			L.mapbox.accessToken = 'pk.eyJ1IjoiYnVybmluZyIsImEiOiJBSUt1Z1JvIn0.B9XLW7EfsPIFuYlWbBCOaw';

			$scope.map = L.mapbox.map('map', 'burning.m0ic6jl6', {
				center: [53.902216, 27.561839],
				zoom: 15
			});*/

			//mapboxService.init({ accessToken: 'pk.eyJ1IjoiYnVybmluZyIsImEiOiJBSUt1Z1JvIn0.B9XLW7EfsPIFuYlWbBCOaw' });

			$scope.init = function(){
        
		        $scope.center = {
		            autoDiscover: true,
		            zoom: 15
		        };
		        
		        //define mapbox as the map
		        $scope.layers = {
		            baselayers: {
		                mapbox_terrain: {
		                    name: 'Mapbox Terrain',
		                    url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYnVybmluZyIsImEiOiJBSUt1Z1JvIn0.B9XLW7EfsPIFuYlWbBCOaw',
		                    type: 'xyz',
		                    layerOptions: {
		                        apikey: 'pk.eyJ1IjoiYnVybmluZyIsImEiOiJBSUt1Z1JvIn0.B9XLW7EfsPIFuYlWbBCOaw',
		                        mapid: 'burning.m0ic6jl6'
		                    }
		                }
		            }
		        };

		        $scope.markers = {};
		    };

		    //init map
		    $scope.init();

		    // update markers dynamically, temporary solution
		    $scope.$watch('meetings', function () {
		    	if($scope.meetings){
		    		for (var i = 0; i < $scope.meetings.length; i++) {
					    $scope.markers['m' + i] = {
					        lat: + $scope.meetings[i].latitude,
					        lng: + $scope.meetings[i].longitude,
					        message: $scope.meetings[i].title
					    };
					};
		    	};
		    });

		    // catch click on map
		    $scope.$on('leafletDirectiveMap.click', function(event, args){
			    var leafEvent = args.leafletEvent.latlng;
			    $scope.formData.position = leafEvent;
			    console.log($scope.formData.position);
			    $scope.formData.latitude = leafEvent.lat;
			    $scope.formData.longitude = leafEvent.lng;
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
			};

			$scope.getCoords = function($event){
				/*map.on('click', function($event) {
					var latitude = e.latlng.lat;
					var longitude = e.latlng.lng;
					console.log(latitude + " - " + longitude);
				});*/
				/*console.log($event);
				var latitude = $event.latlng.lat;
				var longitude = $event.latlng.lng;
				console.log(latitude + " - " + longitude);
*/
				//mapboxService.getMapInstances();
				//console.log(mapboxService.getMapInstances());
			};

			$scope.showDialog = function(size){
				//$scope.getCoords($event);
				var modalInstance = $modal.open({
					templateUrl: './public/partials/dialog.tmpl.ejs',
					controller: 'DialogController',
					size: size,
					scope: $scope
				});
				modalInstance.result.then(function(data) {
					$scope.refresh();
					console.log('refreshed')
				}, function() {
					$scope.refresh();
				})
			};


			// side nav
			$scope.toggleNav = function() {
				$mdSidenav('nav').toggle();
			};


}]);