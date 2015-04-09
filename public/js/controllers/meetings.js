// map controller
// public/map.js

findMate.controller('meetingsController', ['$scope', 
                                            '$http', 
                                            '$routeParams',
                                            '$mdSidenav',
                                            '$filter',
                                            'dateFilter',
                                            'editService',
                                            '$mdDialog',
	 function($scope, $http, $routeParams, $mdSidenav, $filter, date, editService, $mdDialog) {

	//expose lodash to scope
	$scope._ = _;

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


    //init logged in user
	$scope.$watch('logged_in_user', function () {
		$scope.loadFriends();
	});

    $scope.refresh = function(){
        $http.get('../api/meetings')
        .success(function(data) {
            $scope.meetings = data;
            var meetings = $scope.meetings;
            console.log(data);
             $scope.loopMeetings(meetings);
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });
    }

    // when landing on the page, get all events and show them
    $scope.refresh();

    $scope.loopMeetings = function(meetings){
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
             meeting.startTime = new Date(meeting.startTime);
             if (meeting.updated_at !== null){
             	meeting.updated_at = new Date(meeting.updated_at);
             }
             meeting.updated = moment(meeting.updated_at).fromNow();
             meeting.created = moment(meeting.created_at).fromNow();
/*
             var invited = meeting.invitedUsers;
             var joined = meeting.joinedUsers;
             meeting.invited = false;
             meeting.joined = false;

             if (invited.indexOf($scope.logged_in_user) > -1){
             	meeting.invited = true;
             } 

             if (joined.indexOf($scope.logged_in_user) > -1){
             	meeting.joined = true;
             } */
         }; // end for loop
    };

    // check buttons state

    $scope.displayDecline = function(meeting){
    	var meeting = meeting;
    	var invited = meeting.invitedUsers;
    	if (invited.indexOf($scope.logged_in_user) > -1){
           	return true;
        } else {
        	return false;
        }
    };

    $scope.displayJoin = function(meeting){
    	var meeting = meeting;
    	var joined = meeting.joinedUsers;
    	if (joined.indexOf($scope.logged_in_user) === -1){
           	return true;
        } else {
        	return false;
        }
    };

      $scope.singleUser = function(id) {
        $http.get('../api/users' + id)
            .success(function(data) {
                $scope.users = data;
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };

    // delete a meeting
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

    // decline invitation

    $scope.declineInvitation = function(id){

        $http.put('/decline/' + id)
            .success(function (data) {
                $scope.users = data;
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });

        $http.put('/declinemeeting/' + id)
            .success(function (data) {
                $scope.meetings = data;
                console.log(data);
                $scope.loopMeetings(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };

    // join meeting

    $scope.joinMeeting = function(id){

        $http.put('/join/' + id)
            .success(function (data) {
                $scope.users = data;
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });

		$http.put('/joinmeeting/' + id)
			.success(function (data) {
				$scope.meetings = data;
				console.log(data);
				$scope.loopMeetings(data);
			})
			.error(function (data) {
				console.log('Error: ' + data);
			});

    };

    // unjoin meeting

    $scope.unjoinMeeting = function(id){

        $http.put('/unjoin/' + id)
            .success(function (data) {
                $scope.users = data;
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });

        $http.put('/unjoinmeeting/' + id)
			.success(function (data) {
				$scope.meetings = data;
				console.log(data);
				$scope.loopMeetings(data);
			})
			.error(function (data) {
				console.log('Error: ' + data);
			})
    };

    // category filter

        var todayDate = new Date();
        $scope.todayDay = todayDate.getDate();

        //datepicker
	      $scope.filterMtn.startDate = new Date();
	       $scope.openDatePicker = function($event) {
	          $event.preventDefault();
	          $event.stopPropagation();

	          $scope.opened = true;
	        };	  

	        $scope.dateOptions = {
	          formatYear: 'yy',
	          startingDay: 1
	        };

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
        console.log($scope.meetingId);
        $scope.showDialog();
    };

    $scope.showDialog = function(ev){
        $mdDialog.show({
          controller: 'EditMeetingController',
          templateUrl: './public/partials/editMeeting.tmpl.ejs',
          targetEvent: ev
             }).then(function(data) {
                  $scope.refresh();
                  console.log('refreshed')
             }, function() {
                  $scope.refresh();
             })     
    };

    
}]);