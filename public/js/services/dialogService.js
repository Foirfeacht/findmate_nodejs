 findMate.service('dialogService', function($rootScope) {

 	var getUsers, users;

    getUsers = function(users){
        this.users = users;
        $rootScope.$broadcast("usersUpdated");
    }      

 		return {
		    users: users,
 			getUsers: getUsers
 		}

});