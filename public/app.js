// public/app.js
var findMate = angular.module('findMate', []);

findMate.controller('mainController', ['$scope', '$http', function($scope, $http) {
  $scope.formData = {};

    // when landing on the page, get all todos and show them
    $http.get('/api/meetings')
        .success(function(data) {
            $scope.meetings = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.createMeeting = function() {
        $http.post('/api/meetings', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.meetings = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a todo after checking it
    $scope.deleteMeeting = function(id) {
        $http.delete('/api/meetings/' + id)
            .success(function(data) {
                $scope.meetings = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
}]);

