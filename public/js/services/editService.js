 findMate.service('editService', function($rootScope) {

 	var getId, id, user;

    getId = function(id, user){
        this.id = id;
        this.user = user;
        $rootScope.$broadcast("valuesUpdated");
    }      

 		return {
		    id: id,
		    user: user,
 			getId: getId
 		}

});