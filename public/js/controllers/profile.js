// map controller
// public/map.js

findMate.controller('profileController', ['$scope', '$http', '$mdSidenav', function($scope, $http, $mdSidenav) {
	// side nav
    $scope.toggleNav = function() {
       $mdSidenav('nav').toggle();
    };

    $scope.getUserImage = function(){
        var user = $scope.logged_in_user;
        if ($scope.logged_in_user.image = 'facebook'){
                $scope.currentUserPic = 'https://graph.facebook.com/' + user.facebook.id + '/picture?height=350&width=250';
        };
        if ($scope.logged_in_user.image = 'vkontakte'){
                $scope.currentUserPic = user.vkontakte.image;
        };
    };

    //init logged in user
    $scope.$watch('logged_in_user', function () {
        $scope.getUserImage();
    });

    var friendsRequest = 'https://graph.facebook.com/' + $scope.logged_in_user.facebook.id + '/friends' + '?access_token=' + $scope.logged_in_user.facebook.token;
        $http.get(friendsRequest)
            .success(function(data) {
                $scope.friends = data.data;
                $scope.frList = {};
                console.log(data.data);

            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    
}]);