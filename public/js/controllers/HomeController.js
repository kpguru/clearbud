'use strict';

	app.controller('HomeController', function ($scope, $window, $location,AuthenticationService) {
         $scope.signedIn = AuthenticationService.signedIn;
         console.log($scope.signedIn.email, $scope.signedIn.role,'e,adfdi');

	})
	   