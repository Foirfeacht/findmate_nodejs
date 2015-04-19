// map controller
// public/map.js

findMate.controller('profileController', ['$scope', '$http', '$mdSidenav', function($scope, $http, $mdSidenav) {
	// side nav
    $scope.toggleNav = function() {
       $mdSidenav('nav').toggle();
    };

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
        $scope.facebookImage = $scope.logged_in_user.facebook ? true : false;
        $scope.vkontakteImage = $scope.logged_in_user.vkontakte ? true : false;
        console.log ($scope.facebookImage + ' '  + $scope.vkontakteImage + ' ' + $scope.selectImageButton);
    }

    $scope.selectImage = function (image, provider) {
        $scope.selectedImage = image;
        console.log($scope.selectedImage);
        if (provider === 'facebook') {
           $scope.facebookSelected = true; 
        }
        if (provider = "vk"){
            $scope.vkSelected = true;
        }
    }

    $scope.changeProfileImage = function(){
        $scope.toggleSelectorButton = true;

    }

    /*var friendsRequest = 'https://graph.facebook.com/' + $scope.logged_in_user.facebook.id + '/friends' + '?access_token=' + $scope.logged_in_user.facebook.token;
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