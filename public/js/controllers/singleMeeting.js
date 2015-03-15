// map controller
// public/map.js

findMate.controller('singleMeetingController', ['$scope', '$http', '$routeParams', '$mdSidenav', function($scope, $http, $routeParams, $mdSidenav) {

    //load input data
	console.log($routeParams);
    
    // when landing on the page, get all events and show them
    //$scope.renderMeeting = function(id){
	    /*$http.get('../api/meetings/' + user._id, {
	    		//params: { id: user.id }
	    		//url: 
	    	})
	        .success(function(data) {
	            $scope.meetings = data;
	            console.log(data);
	        })
	        .error(function (data) {
	            console.log('Error: ' + data);
	        });
	//}

	//$scope.$watch('$viewContentLoaded', function() {
    //    $scope.renderMeeting();
    //});

	/*var meeting = Meeting.get({ id: $scope.id }, function() {
	    console.log(meeting);
	  });

	var meetings = Meeting.query(function() {
	    console.log(meetings);
	  }); 
*/


    

    // delete a todo after checking it
    $scope.deleteMeeting = function(id) {
        $http.delete('../api/meetings/' + id)
            .success(function (data) {
                $scope.meetings = data;
                console.log(data);
                $scope.deleteMarkers();
                var l = data.length;
                    for( var i = 0; i < l; i++) {
                        var latLng = new google.maps.LatLng(data[i].latitude, data[i].longitude);
                        var marker = new google.maps.Marker({
                            position: latLng,
                            map: $scope.map
                        });
                }
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
        console.log('clicked');
        $http.put('/api/meetings/' + id)
            .success(function (data) {
                $scope.meetings = data;
                data.active = false;
                console.log('function active');
            })
            .error(function (data) {
                console.log('Error: ' + data);
            })
    };

    // side nav
    $scope.toggleNav = function() {
       $mdSidenav('nav').toggle();
    };
}]);