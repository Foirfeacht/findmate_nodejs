 findMate.service('mapService', function($rootScope) {

 	var getCoords, latLng;

    getCoords = function(latLng){
        this.latLng = latLng;
        $rootScope.$broadcast("valuesUpdated");
    }      

 		return {
      latLng: latLng,
 			getCoords: getCoords
 		}

});