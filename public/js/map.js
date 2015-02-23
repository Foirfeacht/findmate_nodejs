function initialize() {
        var mapOptions = {
          center: new google.maps.LatLng(-34.397, 150.644),
          zoom: 8,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map_canvas"),
            mapOptions);

        google.maps.event.addListener(map, "click", function (event) {
	        var latitude = event.latLng.lat();
	        var longitude = event.latLng.lng();
	        //return coords
	    }); //end addListener
}
