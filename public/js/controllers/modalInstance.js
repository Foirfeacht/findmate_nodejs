findMate.controller('ModalInstanceCtrl', function ($scope, $modalInstance) {

  $scope.ok = function () {
    $modalInstance.close($scope.selectedItem);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
