findMate.filter('currentUserFilter', function () {
	return function (meetings, id) {
		var filterResult = [];

		for (var i = 0; i < items.length; i++) {
			if (i.owner._id = id) // filter by name only
				filterResult.push(i);
		}
		console.log(filterResult);
		return filterResult;
	}
});