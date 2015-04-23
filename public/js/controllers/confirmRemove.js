findMate.controller('confirmRemoveController', ['$scope', '$http', '$modalInstance',
  function($scope, $http, $modalInstance) {

  $scope.userId = $scope.currentUser._id

   $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

}]);

