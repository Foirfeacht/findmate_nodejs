// map controller
// public/map.js

findMate.controller('meetingsController', ['$scope', '$http', '$routeParams', '$mdSidenav', '$filter', 'dateFilter',
					 function($scope, $http, $routeParams, $mdSidenav, $filter, date) {


    
    
    // when landing on the page, get all events and show them
    $http.get('../api/meetings')
        .success(function(data) {
            $scope.meetings = data;
            console.log(data);
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });

    $http.get('../api/users')
        .success(function(data) {
            $scope.users = data;
            console.log(data);
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });


    $scope.singleMeeting = function(id) {
        $http.get('../api/meetings' + id)
            .success(function(data) {
                $scope.meetings = data;
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
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

    //update meeting
    $scope.updateMeeting = function (id) {
        // not implemented yet
    };
;

    $scope.completeMeeting = function(id){
        $http.put('/api/meetings/' + id)
            .success(function (data) {
                $scope.meetings = data;
                //$scope.active = false;
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            })
    };

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

    // category filter

        var todayDate = new Date();
        $scope.todayDay = todayDate.getDate();

        $scope.categories = [{name: 'Спорт'}, {name: 'Развлечения'}];

        $scope.visibilities = [{name: 'Общие'}, {name: 'Друзья'}];


		$scope.getFriends = function (user) {

			 var friendsRequest = 'https://graph.facebook.com/' + user.facebook.id + '/friends' + '?access_token=' + user.facebook.token;
			 $http.get(friendsRequest)
				 .success(function(data) {
					 $scope.friends = data.data;
					 console.log(data.data);
				 })
				 .error(function (data) {
					 console.log('Error: ' + data);
				 });
		 }



    //tabs
    $scope.data = {
      selectedIndex : 0
    };
    $scope.next = function() {
      $scope.data.selectedIndex = Math.min($scope.data.selectedIndex + 1, 2) ;
    };
    $scope.previous = function() {
      $scope.data.selectedIndex = Math.max($scope.data.selectedIndex - 1, 0);
    };



    // logged in user filter
   /*	filteredMeetings = $filter(this.meetings, {name: $scope.logged_in_user}, function(actual, expected) {
			return actual.participants.indexOf(expected) > -1;
	});
*/


    // side nav
    $scope.toggleNav = function() {
       $mdSidenav('nav').toggle();
    };
}]);