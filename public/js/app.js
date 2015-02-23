// public/app.js
//var Meeting    = require('../app/models/meeting'); 

var findMate = angular.module('findMate', ['ui.bootstrap']);

findMate.controller('mainController', ['$scope', '$http', 'ui.bootstrap', function($scope, $http) {
  $scope.formData = {};

    // when landing on the page, get all todos and show them
    $http.get('/api/meetings')
        .success(function (data) {
            $scope.meetings = data;
            console.log(data);
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.createMeeting = function() {
        $http.post('/api/meetings', $scope.formData)
            .success(function (data) {
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
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };
}]);

findMate.controller('mapController', ['$scope', '$http', '$modal', function($scope, $http, $modal) {
  $scope.formData = {};

    // when landing on the page, get all todos and show them
    $http.get('/api/meetings')
        .success(function(data) {
            $scope.meetings = data;
            console.log(data);
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.createMeeting = function() {
        $http.post('/api/meetings', $scope.formData)
            .success(function (data) {
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

    $scope.completeMeeting = function(id){
        console.log('clicked');
        $http.put('/api/meetings/' + id)
            .success(function (data) {
                console.log('functiona active');
            })
            .error(function (data) {
                console.log('Error: ' + data);
            })
    }

    $scope.showModal = function(id){
        console.log('clicked');
    }

    //modal
    $scope.open = function (size) {

        var modalInstance = $modal.open({
          templateUrl: 'myModalContent.html',
          controller: 'ModalInstanceCtrl',
          size: size
        });

        modalInstance.result.then(function (selectedItem) {
          $scope.selected = selectedItem;
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
      };

   
   
}]);

findMate.controller('ModalInstanceCtrl', function ($scope, $modalInstance) {

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});

