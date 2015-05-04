findMate.service('restService', function ($rootScope, $http) {
	var declineInvitation = function (id) {
			$http.put('/decline/meetings/' + id)
				.success(function (data) {
				})
				.error(function (data) {
					console.log('Error: ' + data);
				});
		};

	// join meeting
		var joinMeeting = function (id) {
			$http.put('/join/meetings/' + id)
				.success(function (data) {
				})
				.error(function (data) {
					console.log('Error: ' + data);
				});

		};

		// unjoin meeting
		var unjoinMeeting = function (id) {

			$http.put('/unjoin/meetings/' + id)
				.success(function (data) {
				})
				.error(function (data) {
					console.log('Error: ' + data);
				})
		};

	return {
		declineInvitation: declineInvitation,
		joinMeeting: joinMeeting,
		unjoinMeeting: unjoinMeeting
	}
});