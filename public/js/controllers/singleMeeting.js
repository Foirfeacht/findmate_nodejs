// map controller
// public/map.js

findMate.controller('singleMeetingController', ['$scope', '$http', '$routeParams', '$location', '$mdSidenav', function($scope, $http, 
	$routeParams, $location, $mdSidenav) {
    



    // delete a todo after checking it
    $scope.deleteMeeting = function(id) {
        $http.delete('../api/meetings/' + id)
            .success(function (data) {
                $scope.meetings = data;
                console.log(data);
                $location.url('http://localhost:8080/meetings');
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