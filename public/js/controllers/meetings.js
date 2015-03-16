// map controller
// public/map.js

findMate.controller('meetingsController', ['$scope', '$http', '$routeParams', '$mdSidenav', 'routingService', function($scope, $http, $routeParams, $mdSidenav, routingService) {

    //load input data

    //$scope.idParam = routingService.idParam;
    $scope.updateValue = function(id) {
        this.id = $scope.idParam;
        console.log(id);
    };

    console.log($scope.idParam);

    $scope.$watch('idParam', function() {
        routingService.getParam($scope.idParam);
    });

    $scope.$on('valuesUpdated', function() {
        $scope.idParam = routingService.idParam;
        console.log($scope.idParam)
    });




    
    
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