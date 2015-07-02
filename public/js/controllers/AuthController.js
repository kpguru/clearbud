'use strict';

	app.controller('AuthController', function ($rootScope, $scope, $window, $location,AuthenticationService, $firebase, toaster, FIREBASE_URL) { 
        $scope.signedIn = AuthenticationService.signedIn;      
	    var customer = {
	    	email:'',
	    	password:'',
	    	role:''
	    };

    
	    $scope.customersignup = function(customer){		    
		     customer.role="customer";
		     customer.phone='';
		     customer.isApproved= 1;
		     AuthenticationService.signup(customer).then(function () {
		            toaster.pop('success', "Register successfully!");
		            window.location = "#/customer-dashboard";
		        }, function (error) {
		            toaster.pop('error', "Error..!", error.toString());
		        });
		};  
		$scope.cleanersignup = function(cleaner){ 
		     cleaner.role="cleaner";
		     cleaner.isApproved = 0; 
		     cleaner.phone=cleaner.phone?cleaner.phone:" ";  
		     AuthenticationService.signup(cleaner).then(function () {
		            toaster.pop('success', "Register successfully!");
		            //$location.path("/home").replace();
		            window.location = "#/cleaner-dashboard";
		        }, function (error) {
		            toaster.pop('error', "Error..!", error.toString());
		        });
		}; 
		$scope.socialCustomerRegister =function(provider){
			var ref = new Firebase(FIREBASE_URL);
	        ref.authWithOAuthPopup(provider, function(error, authData){
                if (error) {
				    console.log("Login Failed!", error);
				} else {
					    if(provider == "google")
					    {
							var data = {
						                    email: authData.google.cachedUserProfile.email,
						                    password: authData.google.id  
						               };
							    $scope.customersignup(data);
						}else{
							var data = {
						                    email: authData.facebook.cachedUserProfile.email,
						                    password: authData.facebook.id 
						               };
							    $scope.customersignup(data);
						}
					}
	              },{scope:"email"});
         
		};
		$scope.socialCleanerRegister =function(provider){
			var ref = new Firebase(FIREBASE_URL);
	        ref.authWithOAuthPopup(provider, function(error, authData){
                if (error) {
				    console.log("Sign up Failed!", error);
				} else {
					     if(provider == "google")
					    {
							var data = {
						                    email: authData.google.cachedUserProfile.email,
						                    password: authData.google.id  
						               };
							    $scope.cleanersignup(data);
						}else{
							var data = {
						                    email: authData.facebook.cachedUserProfile.email,
						                    password: authData.facebook.id 
						               };
							    $scope.cleanersignup(data);
						}
					}
	              },{scope:"email"});
         
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
		                	if(data.isApproved== 1){
		                	   toaster.pop('success', "Logged in successfully!");
		                     window.location = "#/cleaner_profiles/"+ data.$id;
		                     }else{
		                     	toaster.pop('success', "Logged in successfully!,Your Profile is Not Approved by Admin");
		                         window.location = "#/cleaner-dashboard";
		                     }
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
	    $scope.socialLogin = function(provider){
	        var ref = new Firebase(FIREBASE_URL);
	        ref.authWithOAuthPopup(provider, function(error, authData){
                if (error) {
				    console.log("Login Failed!", error); 
				} else {
					      if(provider == "google"){
							  var data = {
													 email: authData.google.cachedUserProfile.email,
													 password: authData.google.id  
						               };
							             $scope.login(data);
								}else{
									var data = {	
										       email: authData.facebook.cachedUserProfile.email,
													 password: authData.facebook.id 
													};
										     	$scope.login(data);
								}
				  }
	        },{scope:"email"});
        }
        $scope.resetPassword = function (reset) {
	        if(!reset.email){
	            toaster.pop('error', "Email field can't be empty.");
	            return false;
	        }
	        AuthenticationService.resetPassword(reset).then(function () {
	            toaster.pop('success', "Password reset email sent successfully.");
	        }, function(error){
	            toaster.pop('error', "Error sending password reset email:", error.toString());
	        });
	    }
	    $scope.changePassword = function (change){
	    	AuthenticationService.changePassword(change).then(function () {
	            toaster.pop('success', "Password change successfully.");
	        }, function(error){
	            toaster.pop('error', "Error change password", error.toString());
	        });
	    }
	    $scope.logout = function () {
	        AuthenticationService.logout();
	         $rootScope.isCleaner = false;
	        toaster.pop('success', 'Logged out successfully!');
	        $location.path('/');
        };

    })
