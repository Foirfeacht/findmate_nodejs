 google.maps.event.addListener($scope.map, "click", function (event) {
            $scope.formData.latitude = event.latLng.lat();
            $scope.lat = $scope.formData.latitude;
            $scope.formData.longitude = event.latLng.lng();
            $scope.lng = $scope.formData.longitude;
            console.log($scope.formData.longitude);
}