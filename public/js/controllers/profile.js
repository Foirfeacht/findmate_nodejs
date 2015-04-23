// map controller
// public/map.js

findMate.controller('profileController', ['$scope', '$http', '$mdSidenav', '$modal',
 function($scope, $http, $mdSidenav, $modal) {
	// side nav
    $scope.toggleNav = function() {
       $mdSidenav('nav').toggle();
    };

    $http.get('/current_user')
	     .success(function(data) {
			$scope.currentUser = data;
			$scope.loadFriends();
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

    $scope.toggleImageSelector = function(){
        $scope.toggleSelectorButton = false;
        $scope.selectImageButton = true;
        $scope.facebookImage = $scope.currentUser.facebook ? true : false;
        $scope.vkontakteImage = $scope.currentUser.vkontakte ? true : false;
        console.log ($scope.facebookImage + ' '  + $scope.vkontakteImage + ' ' + $scope.selectImageButton);
    }

    $scope.selectImage = function (image, provider) {
        $scope.selectedImage = image;
        console.log($scope.selectedImage);
        if (provider === 'facebook') {
           $scope.facebookSelected = true; 
        }
        if (provider === "vk"){
            $scope.vkSelected = true;
        }
    }

    $scope.changeProfileImage = function(){
        $scope.toggleSelectorButton = true;
    }

    $scope.showConfirm = function(size){
        var modalInstance = $modal.open({
          templateUrl: './public/partials/confirmRemove.tmpl.ejs',
          controller: 'confirmRemoveController',
          size: size,
          scope: $scope
        });    
    };


    /*var friendsRequest = 'https://graph.facebook.com/' + $scope.currentUser.facebook.id + '/friends' + '?access_token=' + $scope.currentUser.facebook.token;
        $http.get(friendsRequest)
            .success(function(data) {
                $scope.friends = data.data;
                $scope.frList = {};
                console.log(data.data);

            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    */
}]);