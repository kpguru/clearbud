'use strict';

	app.controller('AuthController', function ($scope, $window, $location,AuthenticationService, $firebase, toaster, FIREBASE_URL) { 
        $scope.signedIn = AuthenticationService.signedIn;       
    var customer = {
    	email:'',
    	password:'',
    	role:''
    };
	    $scope.customersignup = function(customer){
		     if(!$scope.customersignup.email){
		     	return;
		     }
		     if($scope.customersignup.password!= $scope.customersignup.confirm_password){
		      return;
		     }     
		     customer.role="customer";
		     customer.phone='';
		     customer.isApproved='1';
		     AuthenticationService.signup(customer).then(function () {
		            toaster.pop('success', "Register successfully!");
		            window.location = "#/customer-dashboard";
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
		     cleaner.isApproved = 0;   
		     AuthenticationService.signup(cleaner).then(function () {
		            toaster.pop('success', "Register successfully!");
		            //$location.path("/home").replace();
		            window.location = "#/cleaner-dashboard";
		        }, function (error) {
		            toaster.pop('error', "Error..!", error.toString());
		        });
		}; 
		$scope.login = function (user) {		
	        AuthenticationService.login(user).then(function (data) { 
        	    var users = AuthenticationService.getCurrentUser(data.uid);
                    users.$loaded().then(function (data) {		                
                    if(data.role== "customer"){
                    	toaster.pop('success', "Logged in successfully!");
                        window.location = "#/customer-dashboard";
	                }else{
	                	 if(data.role == "cleaner"){
		                	 toaster.pop('success', "Logged in successfully!");
		                     window.location = "#/cleaner-dashboard";
		                 }else{
		                 	 toaster.pop('success', "Logged in successfully!");
		                     window.location = "#/admin-dashboard";
		                 }
	                }
               });  
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