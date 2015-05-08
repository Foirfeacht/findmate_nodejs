/**
 * Created by vmaltsev on 5/8/2015.
 */
findMate.factory('fetchData', function ($rootScope, $http) {

	return {
		getCurrentUser : function(params){
			return $http.get('/current_user')
		}
	}
});