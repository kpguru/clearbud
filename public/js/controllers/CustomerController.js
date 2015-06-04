'use strict';

	app.controller('CustomerController', function ($scope, $window, $location,AuthenticationService, $firebase, toaster, FIREBASE_URL) { 
        $scope.signedIn = AuthenticationService.signedIn;
    });