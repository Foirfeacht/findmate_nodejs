/**
 * Created by vmaltsev on 5/8/2015.
 */
findMate.factory('fetchUser', function ($rootScope, $http) {

	return {
		getMeetings : function(params){
			return $http.get('../api/meetings')
		}
	}
});