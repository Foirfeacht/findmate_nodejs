 findMate.service('mapService', function($rootScope) {

 	var getCoords, latLng, user;

    getCoords = function(latLng, user){
        this.latLng = latLng;
        this.user = user;
        $rootScope.$broadcast("valuesUpdated");
    }      

 		return {
		    latLng: latLng,
		    user: user,
 			getCoords: getCoords
 		}

});