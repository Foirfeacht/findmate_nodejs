// map controller
// public/map.js

findMate.controller('profileController', ['$scope', '$http', '$mdSidenav', '$modal',
	function ($scope, $http, $mdSidenav, $modal) {
		// side nav
		$scope.toggleNav = function () {
			$mdSidenav('nav').toggle();
		};

		$http.get('/current_user')
			.success(function (data) {
				$scope.currentUser = data;
			})
			.error(function (data) {
				console.log('Error: ' + data);
			});

		// image selector
		$scope.toggleSelectorButton = true;
		$scope.facebookImage = false;
		$scope.vkontakteImage = false;
		$scope.selectImageButton = false;
		$scope.selectedImage = null;
		$scope.vkSelected = false;
		$scope.facebookSelected = false;

		$scope.toggleImageSelector = function () {
			$scope.toggleSelectorButton = false;
			$scope.selectImageButton = true;
			$scope.facebookImage = $scope.currentUser.facebook ? true : false;
			$scope.vkontakteImage = $scope.currentUser.vkontakte ? true : false;
		}

		$scope.selectImage = function (image, provider) {
			var user = $scope.currentUser;
			$scope.selectedImage = image;
			console.log($scope.selectedImage);
			if (user.facebook && image === user.facebook.image) {
				$scope.facebookSelected = true;
			}
			if (user.vk && image === user.vk.image) {
				$scope.vkSelected = true;
			}
		}

		$scope.changeProfileImage = function () {
			$scope.toggleSelectorButton = true;
			if ($scope.selectedImage) {
				var user = $scope.currentUser;
				var image = $scope.selectedImage;
				console.log(image);
				$http.put('/update_userimage/users/' + user._id, {image: image})
					.success(function (data) {
						$scope.currentUser = data;
						console.log(data);
						$scope.facebookImage = false;
						$scope.vkontakteImage = false;
						$scope.selectImageButton = false;
					})
					.error(function (data) {
						console.log('Error: ' + data);
					});
			}
			;
		}

		$scope.showConfirm = function (size) {
			var modalInstance = $modal.open({
				templateUrl: './public/partials/confirmRemove.tmpl.ejs',
				controller: 'confirmRemoveController',
				size: size,
				scope: $scope
			});
		};

	}]);