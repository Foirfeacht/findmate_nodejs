findMate.factory('Meeting', function ($resource) {
	return $resource('/api/meetings/:id');
})