/**
 * Created by vmaltsev on 5/5/2015.
 */
findMate.service('notificationService', function ($rootScope) {

	var notification, getNotification;

	getNotification = function (notification) {
		this.notification = notification;
		$rootScope.$broadcast("notificationUpdated");
	}

	return {
		getNotification: getNotification,
		notification: notification
	}

});