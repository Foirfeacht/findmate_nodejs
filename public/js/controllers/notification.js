/**
 * Created by vmaltsev on 4/29/2015.
 */
findMate.controller('notificationController', ['$scope', '$http', '$mdToast', 'notificationService',
	function ($scope, $http, $mdToast, notificationService) {

		$scope.notification = notificationService.notification;
		console.log(notificationService.notification);

		$scope.closeToast = function() {
			$mdToast.hide();
		};

	}]);