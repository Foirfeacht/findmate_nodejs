/**
 * Created by vmaltsev on 4/29/2015.
 */
findMate.controller('notificationController', ['$scope', '$http', '$mdToast',
	function ($scope, $http, $mdToast) {

		console.log($scope.addedNotification);

		$scope.closeToast = function() {
			$mdToast.hide();
		};

	}]);