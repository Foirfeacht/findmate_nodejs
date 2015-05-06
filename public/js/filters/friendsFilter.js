findMate.filter('friendsFilter', function () {
	return function (meetings, currentUser) {
		var filterResult = [];

		for (var i = 0; i < items.length; i++) {
			if (objects[index].participants.indexOf(logged_in_user) != -1) // filter by name only
				filterResult.push(objects[index]);
		}
		console.log(filterResult);
		return filterResult;
	}
});