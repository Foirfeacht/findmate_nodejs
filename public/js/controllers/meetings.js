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




		 $scope.friendsArray = [];
		 $scope.friendsMeetings = [];



		//init logged in user
		$scope.$watch('logged_in_user', function () {
			 console.log($scope.logged_in_user);
			$scope.loadFriends();


		});

		 /*$scope.init = function(user) {
			 $scope.logged_in_user = user;
			 console.log($scope.logged_in_user);
		 }*/

		 $scope.loadFriends = function(){
			 var friendsRequest = 'https://graph.facebook.com/' + $scope.logged_in_user.facebook.id + '/friends' + '?access_token=' + $scope.logged_in_user.facebook.token;
			 $http.get(friendsRequest)
				 .success(function(data) {
					 $scope.friends = data.data;
					 console.log(data.data);
					 $scope.updateFriendsArray($scope.friends);
					 $scope.updateFriendsMeetings($scope.meetings, $scope.users);
				 })
				 .error(function (data) {
					 console.log('Error: ' + data);
				 });
		 };

		 $scope.updateFriendsArray = function(data){
			 var friends = data;
			 var l = friends.length;
			 for(var key in friends){
				 if (friends.hasOwnProperty(key)) {
					 var friend = friends[key];
					 $scope.friendsArray.push(friend.id);

				 }
			 }
		 }

		 $scope.updateFriendsMeetings = function (data, users) {
			 var meetings = data;
			 var userList = users;
			 var lm = meetings.length;
			 var lu = userList.length;
			 for(var u =0; u < lu; u++){
				 var user = users[i];
				 var facebookId = user.facebook.id;
				 console.log(facebookId);
			 };
			 for(var i = 0; i < lm; i++) {
				 var meeting = meetings[i];
				 var id = meeting._owner._id;
				 console.log(id);
				 if ($scope.friendsArray.indexOf(id) > -1){
					 console.log(meeting);
				 }

			 };
			 console.log($scope.friendsArray);
		 }

		 $scope.friendsArray = [];
		 $scope.friendsMeetings = [];






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