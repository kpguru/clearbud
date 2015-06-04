'use strict';

	app.controller('CleanerController', function ($scope, $window, $location,AuthenticationService, $firebase, toaster, FIREBASE_URL) { 
        $scope.signedIn = AuthenticationService.signedIn;
        $scope.currentUser = AuthenticationService.user;
         
    });