// map controller
// public/map.js

findMate.controller('meetingsController', ['$scope', 
                                            '$http', 
                                            '$routeParams',
                                            '$mdSidenav',
                                            '$filter',
                                            'dateFilter',
                                            'editService',
                                            '$modal',
	 function($scope, $http, $routeParams, $mdSidenav, $filter, date, editService, $modal) {

	//expose lodash to scope
	$scope._ = _;
	
	//init logged in user
	$scope.$watch('logged_in_user', function () {
		$scope.loadFriends();
		$scope.refresh();
	});

	//get users

	$http.get('../api/users')
		 .success(function(data) {
			$scope.users = data;
			console.log(data);
		})
		.error(function (data) {
		    console.log('Error: ' + data);
      	});

	$scope.loadFriends = function(){
		 var friendsRequest = 'https://graph.facebook.com/' + $scope.logged_in_user.facebook.id + '/friends' + '?access_token=' + $scope.logged_in_user.facebook.token;
		 $http.get(friendsRequest)
			 .success(function(data) {
				 $scope.friends = data.data;
			 })
			 .error(function (data) {
				 console.log('Error: ' + data);
			 });
	 };

    $scope.refresh = function(){
        $http.get('../api/meetings')
        .success(function(data) {
            $scope.meetings = data;
            var meetings = $scope.meetings;
            console.log(data);
             $scope.loopMeetings(meetings);
				// ng show for buttons

				$scope.showButton = function(array) {
					var id = $scope.logged_in_user._id;
					var i, obj;
					for (i = 0; i < array.length; ++i) {
						obj = array[i];
						if (obj._id == id) {
							return true;
						}
					};
					return false;
				};

				$scope.checkOwner = function(id){
					var currentUserId = $scope.logged_in_user._id;
					if (id === currentUserId){
						return true;
					}
					return false;
				}
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });
    }

    // when landing on the page, get all events and show them


    $scope.loopMeetings = function(meetings){
		    var meetings = meetings;
        var dateNow = new Date().toJSON();

        // loop through data
        var meetingsLength = meetings.length;
         for(var i = 0; i < meetingsLength; i++) {
             var meeting = meetings[i];


             // date filter
             var meetingDate = meeting.startDate;
             if (meetingDate > dateNow){
                 meeting.active = true;
             } else {
                meeting.active = false;
             };// end date filter

             //format dates
             meeting.startDate = new Date(meeting.startDate);
             if (meeting.updated_at !== null){
             	meeting.updated_at = new Date(meeting.updated_at);
             }
             meeting.updated = moment(meeting.updated_at).fromNow();
             meeting.created = moment(meeting.created_at).fromNow();

		/*	meeting.invitedUsers = _.uniq(meeting.invitedUsers,
				  function(item, key, a){
				  return item.a;
				  });

			 meeting.joinedUsers = _.uniq(meeting.joinedUsers,
			      function(item, key, a){
				  return item.a;
			  });*/

/*

 			var invitedArray = meeting.invitedUsers;
 			var invitedArrayLength = invitedArray.length;
 			for (var u = 0; u< invitedArrayLength; u++){
 				var invitedUser = invitedArray[u];
 					if(invitedUser._id === $scope.logged_in_user._id){
 						meeting.invited = true;
 					} else {
 						meeting.invited = false;
 					};
 			};// end invited filter

 			// joined filter
			 var joinedArray = meeting.joinedUsers;
 			 var joinedArrayLength = joinedArray.length;
 				for (var j = 0; j < joinedArrayLength; j++){
 					var joinedUser = joinedArray[j];
 					if(joinedUser._id === $scope.logged_in_user._id){
						 meeting.joined = true;
 					} else {
 						meeting.joined = false;
 					};
 				};// end joined filter */
         }; // end for loop
    };



    // delete a meeting
    $scope.deleteMeeting = function(id) {
        $http.delete('../api/meetings/' + id)
            .success(function (data) {
                $scope.meetings = data;
                console.log(data);
				$scope.refresh();
				
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // decline invitation

    $scope.declineInvitation = function(id){

       $http.put('/decline/meetings/' + id)
            .success(function (data) {
                //$scope.meetings = data;
                console.log(data);
			   $scope.refresh();
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };

    // join meeting

    $scope.joinMeeting = function(id){
  		$http.put('/join/meetings/' + id)
  			.success(function (data) {
  				//$scope.meetings = data;
  				console.log(data);
				$scope.refresh();
  			})
  			.error(function (data) {
  				console.log('Error: ' + data);
  			});

    };

    // unjoin meeting

    $scope.unjoinMeeting = function(id){

        $http.put('/unjoin/meetings/' + id)
    			.success(function (data) {
    				//$scope.meetings = data;
    				console.log(data);
					$scope.refresh();
    			})
    			.error(function (data) {
    				console.log('Error: ' + data);
    			})
    };

    // category filter

    var todayDate = new Date();
    $scope.todayDay = todayDate.getDate();

    //datepicker 

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

  $scope.showMeridian = false;
  $scope.hstep = 1;
	$scope.mstep = 15;

    $scope.format = 'yyyy/MM/dd';

    $scope.categories = [{name: 'Спорт'}, {name: 'Развлечения'}];

    $scope.visibilities = [{name: 'Общие'}, {name: 'Друзья'}];
		 
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

    // side nav
    $scope.toggleNav = function() {
       $mdSidenav('nav').toggle();
    };

    //edit service update

    $scope.$watch('meetingId', function() {
        editService.getId($scope.meetingId, $scope.logged_in_user);
    });

    $scope.$on('valuesUpdated', function() {
        $scope.meetingId = editService.meetingId;
        $scope.logged_in_user = editService.user;
    });

    // edit meeting dialog
    $scope.editMeeting = function(id){
        $scope.meetingId = id;
        $scope.showDialog();
    };

    $scope.showDialog = function(size){
        var modalInstance = $modal.open({
          templateUrl: './public/partials/editMeeting.tmpl.ejs',
          controller: 'EditMeetingController',
          size: size
        });
        modalInstance.result.then(function(data) {
          $scope.refresh();
          console.log('refreshed')
        }, function() {
          $scope.refresh();
        })         
    };
    
}]);