'use strict';

	app.controller('AuthController', function ($scope, $window, $location,AuthenticationService, $firebase, toaster, FIREBASE_URL) { 


    var customer = {
    	email:'',
    	password:'',
    	role:''
    };
    // if(AuthenticationService.signedIn()){
    //     $location.path("index.html#/home").replace();
    // }
	    $scope.customersignup = function(customer){
		     if(!$scope.customersignup.email){
		     	return;
		     }
		     if($scope.customersignup.password!= $scope.customersignup.confirm_password){
		      return;
		     }     
		     customer.role="customer";
		     AuthenticationService.customersignup(customer).then(function () {
		            toaster.pop('success', "Register successfully!");
		            //$location.path("/home").replace();
		            window.location = "#/home";
		        }, function (error) {
		            toaster.pop('error', "Error..!", error.toString());
		        });
		};    
		
		$scope.login = function (user) {
	        AuthenticationService.login(user).then(function (data) {
	        	console.log(data.role);
	                toaster.pop('success', "Logged in successfully!");
	                //$location.path("/home").replace();
	                window.location = "#/home";
	            }, function (error) {
	                toaster.pop('error', "Error..!", error.toString());
	            });

	    };
    })