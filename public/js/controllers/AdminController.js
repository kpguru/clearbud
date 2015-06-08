'use strict';

	app.controller('AdminController', function ($scope, $http, $window, $location, AdminService, CleanerService, AuthenticationService, CustomerService, $firebase, toaster, FIREBASE_URL) { 
        $scope.signedIn = AuthenticationService.signedIn;
        $scope.setStatus = 0;
        $scope.cleanerInfo = {};
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
                
                $scope.setUserStatus = function(status){
                    $scope.setStatus = status;
                }

                $scope.setCleanerStatus = function(cleanerId,status){
                    if($scope.setStatus == 0 )
                    {
                        if(confirm('Are you sure to Approve Cleaner')){
                            $scope.cleanerInfo.isApproved = status;
                            AdminService.updateCleanerStatus(cleanerId,$scope.cleanerInfo).then(function(data){ 
                               toaster.pop('success', "Cleaner Approved Successfully");
                            });
                        }
                    }else{
                        if($scope.setStatus == 1 )
                        {
                            if(confirm('Are you sure to Reject Cleaner'))
                            {
                                $scope.cleanerInfo.isApproved = status;
                                AdminService.updateCleanerStatus(cleanerId,$scope.cleanerInfo).then(function(data){ 
                                  toaster.pop('success', "Cleaner Rejected Successfully");
                                });
                            }
                        }
                        else{
                            if(confirm('Are you sure to Approve Cleaner'))
                            {
                                $scope.cleanerInfo.isApproved = status;
                                AdminService.updateCleanerStatus(cleanerId,$scope.cleanerInfo).then(function(data){ 
                                  toaster.pop('success', "Cleaner Approved Successfully");
                                });
                            }
                        }
                    }                
                }
            }
        });
    });