 findMate.service('mapService', function() {

 	var pos, map, latitude, longitude, getCoords;

 	 var initialize = function () {

 	 	var mapOptions = {
          center: pos || new google.maps.LatLng(53.902216, 27.561839),
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map(document.getElementById("map_canvas"),
            mapOptions);

        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
              pos = new google.maps.LatLng(position.coords.latitude,
                                               position.coords.longitude);

              map.setCenter(pos);
              console.log('positioned at ' + pos)
            }, function() {
              handleNoGeolocation(true);
            });
            } else {
            // Browser doesn't support Geolocation
            handleNoGeolocation(false);
            }

            function handleNoGeolocation(errorFlag) {
	            if (errorFlag) {
		            consloe.log('Error: The Geolocation service failed.');
	            } else {
		            console.log('Error: Your browser doesn\'t support geolocation.');
	            }
	        }


        google.maps.event.addListener(map, "click", function (event) {
        	console.log('clicked');
            latitude = event.latLng.lat();
            longitude = event.latLng.lng();
            console.log(latitude);
        }); //end addListener

    };

        

        

 		return {
 			initialize: initialize,
 			latitude: latitude,
 			longitude: longitude,
 			map: map,
 			getCoords: getCoords
 		}
});