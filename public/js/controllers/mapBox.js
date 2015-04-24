// map controller
// public/map.js

findMate.controller('mapBoxController', ['$scope', '$http', '$mdSidenav', '$modal', 'mapboxService',
		function($scope, $http, $mdSidenav, $modal, mapboxService) {

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

			/*
			L.mapbox.accessToken = 'pk.eyJ1IjoiYnVybmluZyIsImEiOiJBSUt1Z1JvIn0.B9XLW7EfsPIFuYlWbBCOaw';

			$scope.map = L.mapbox.map('map', 'burning.m0ic6jl6', {
				center: [53.902216, 27.561839],
				zoom: 15
			});*/

			mapboxService.init({ accessToken: 'pk.eyJ1IjoiYnVybmluZyIsImEiOiJBSUt1Z1JvIn0.B9XLW7EfsPIFuYlWbBCOaw' });

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
				mapboxService.getMapInstances();
				console.log(mapboxService.getMapInstances());
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