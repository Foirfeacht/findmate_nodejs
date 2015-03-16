 findMate.service('routingService', function($rootScope) {

 	var getParam, idParam;

    getParam = function(id){
        this.idParam = id;
        $rootScope.$broadcast("valuesUpdated");
    }      

 		return {
		      idParam: idParam,
 			getParam: getParam
 		}

});