'use strict';
  app.controller('HomeController', function ($scope, $routeParams, $http, $window, $location, toaster, $firebaseAuth, FIREBASE_URL, $firebase) { 
    //~ var ref = new Firebase(FIREBASE_URL);
    //~ var firebaseEmails = $firebase(ref.child('emails'));
    $scope.sendEmail = function(contact_us){
      console.log(contact_us);
       $http.post('/contact-us',contact_us).
		    success(function(data, status, headers, config) {
			      console.log(data);
            toaster.pop('success', "Send mail Successfully!");
			      //~ $location.path('/contact-us');
		    }).
		    error(function(data, status, headers, config) {
		    	
		    }); 
      //~ firebaseEmails.$push(contact_us).then(function(data){
        //~ toaster.pop('success', "Send mail Successfully!");
      //~ },function (data) {
              //~ toaster.pop('error', "Error..!", error.toString());
        //~ });
    }
  });
