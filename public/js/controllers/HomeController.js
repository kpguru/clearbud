'use strict';
  app.controller('HomeController', function ($scope, $http, $location, toaster) { 
    $scope.sendEmail = function(contact_us){
      $http.post('/contact-us',contact_us).
		    success(function(data, status, headers, config) {
			    toaster.pop('success', "Send mail Successfully!");
          $location.path('/home');
		    }).
		    error(function(data, status, headers, config) {
		    	toaster.pop('error', "Error in send mail!");
		    }); 
    }
  });
