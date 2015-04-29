/**
 * Created by vmaltsev on 4/29/2015.
 */
findMate.controller('notificationController', ['$scope', '$http', '$mdToast',
	function ($scope, $http, $mdToast) {

		$scope.closeToast = function() {
			$mdToast.hide();
		};

	}]);