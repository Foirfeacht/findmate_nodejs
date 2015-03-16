// map controller
// public/map.js

findMate.controller('meetingsController', ['$scope', '$http', '$routeParams', '$mdSidenav', function($scope, $http, $routeParams, $mdSidenav) {


    
    
    // when landing on the page, get all events and show them
    $http.get('../api/meetings')
        .success(function(data) {
            $scope.meetings = data;
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
    }    

    // delete a todo after checking it
    $scope.deleteMeeting = function(id) {
        console.log(id);
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

    // side nav
    $scope.toggleNav = function() {
       $mdSidenav('nav').toggle();
    };
}]);