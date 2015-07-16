app.controller('ModalGoogleMapController', function ($scope, $modalInstance, googleData) {
    var address = googleData.address1 + ' ' + googleData.address2 + ' ' + googleData.city + ' ' + googleData.state + ' ' + googleData.zip_code;
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': address}, function(results, status) {
        var googleMap = null;
        if(status== 'ZERO_RESULTS'){
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode( { 'address': '' + googleData.state}, function(results) {
                googleMap = results[0].geometry.location;
                mapData(googleMap);
            });
        }else{
            googleMap =  results[0].geometry.location;
            mapData(googleMap);
        }
    });

    function mapData(data){
        $scope.latitude =  data.lat();
        $scope.longitude =  data.lng();
        $scope.zoom = 10;
    }
    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };
});
