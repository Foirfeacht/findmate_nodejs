// map controller
// public/map.js

findMate.controller('profileController', ['$scope', '$http', '$mdSidenav', function($scope, $http, $mdSidenav) {
	// side nav
    $scope.toggleNav = function() {
       $mdSidenav('nav').toggle();
    };

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