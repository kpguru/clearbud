'use strict';

	app.controller('AdminController', function ($scope, $http, $window, $location, AuthenticationService, CustomerService, $firebase, toaster, FIREBASE_URL) { 
        $scope.signedIn = AuthenticationService.signedIn;
        $scope.setDeactive = false;
        var ref = new Firebase(FIREBASE_URL);
        ref.onAuth(function(authUser) {
            if(authUser != null) {

                $scope.get_customers = function(){
                     $scope.cleaners = {};
                    $scope.check_cleaner = false;
                    AuthenticationService.getUsersByRole('customer').$loaded().then(function(data){
                        $scope.customers = data;
                    });
                }

                $scope.get_cleaners = function(){
                    $scope.customers = {};
                    $scope.check_cleaner = true;
                    AuthenticationService.getUsersByRole('cleaner').$loaded().then(function(data){
                        $scope.cleaners = data;
                    });
                }
                
                $scope.setDeactivate = function(status){
                    $scope.setDeactive = status;
                }
            }
        });
    });