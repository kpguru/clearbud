'use strict';

	app.controller('AuthController', function ($scope, $window, $location,AuthenticationService, $firebase, toaster, FIREBASE_URL) { 
        $scope.signedIn = AuthenticationService.signedIn;

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
		     customer.phone='';
		     AuthenticationService.signup(customer).then(function () {
		            toaster.pop('success', "Register successfully!");
		            //$location.path("/home").replace();
		            window.location = "#/home";
		        }, function (error) {
		            toaster.pop('error', "Error..!", error.toString());
		        });
		};  
		$scope.cleanersignup = function(cleaner){
		     if(!$scope.cleanersignup.email){
		     	return;
		     }
		     if($scope.cleanersignup.password!= $scope.cleanersignup.confirm_password){
		      return;
		     }     
		     cleaner.role="cleaner";
		     AuthenticationService.signup(cleaner).then(function () {
		            toaster.pop('success', "Register successfully!");
		            //$location.path("/home").replace();
		            window.location = "#/cleaner-profile";
		        }, function (error) {
		            toaster.pop('error', "Error..!", error.toString());
		        });
		};   
		
		$scope.login = function (user) {			
	        AuthenticationService.login(user).then(function () {
	                toaster.pop('success', "Logged in successfully!");
	                //$location.path("/home").replace();
	                window.location = "#/home";
	            }, function (error) {
	                toaster.pop('error', "Error..!", error.toString());
	            });

	    };
	    $scope.logout = function () {
        AuthenticationService.logout();
        toaster.pop('success', 'Logged out successfully!');
        $location.path('/');
    };

    })