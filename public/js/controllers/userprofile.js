// map controller
// public/map.js

findMate.controller('userController', ['$scope', '$http', '$routeParams', '$mdSidenav',
	 function($scope, $http, $routeParams, $mdSidenav) {

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

    // side nav
    $scope.toggleNav = function() {
       $mdSidenav('nav').toggle();
    };
}]);