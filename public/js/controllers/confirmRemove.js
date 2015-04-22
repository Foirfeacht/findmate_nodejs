findMate.controller('confirmRemoveController', ['$scope', '$http', '$modalInstance',
  function($scope, $http, $modalInstance) {

  console.log($scope.user);
  $scope.userId = $scope.user._id

   $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

}]);

