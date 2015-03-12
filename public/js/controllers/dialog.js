findMate.controller('DialogController', ['$scope', '$http', '$mdDialog', function($scope, $http, $mdDialog) {
  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };

  $scope.formData = {};

  $http.get('../api/meetings')
        .success(function(data) {
            $scope.meetings = data;
            console.log(data);

        })
        .error(function (data) {
            console.log('Error: ' + data);
        });

  $scope.createMeeting = function() {
        //if($scope.latitude && $scope.longitude){
            $http.post('../api/meetings', $scope.formData)
                    .success(function (data) {
                        console.log($scope.formData);

                        $scope.formData = {}; // clear the form so our user is ready to enter another
                        $scope.meetings = data;
                        console.log(data);
                        $mdDialog.hide();
                    })
                    .error(function(data) {
                        console.log('Error: ' + data);
                    })
        //}
        //else {
        //    console.log('no coordinates provided')
        //}
    };
}]);