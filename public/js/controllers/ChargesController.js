'use strict';

    app.controller('ChargesController', function ($scope, $window, $location, ChargesService, AuthenticationService, $firebase, toaster, FIREBASE_URL) { 
        $scope.signedIn = AuthenticationService.signedIn; 

        var ref = new Firebase(FIREBASE_URL);
        ref.onAuth(function(authUser) {
            if (authUser != null) { 
                $scope.saveCharges = function(charges){
                    charges.cleaner_id = authUser.uid;
                      var charge = {
                         every_four_weeks : charges.every_four_weeks,
                         every_two_weeks  : charges.every_two_weeks,
                         one_time         : charges.one_time,
                         weekly           : charges.weekly,
                         cleaner_id       : charges.cleaner_id
                        }
                    ChargesService.addCleanerCharges(charge).then(function(data) {
                        toaster.pop('success', "Add Cleaner Charges successfully!");
                    },function (data) {
                        toaster.pop('error', "Error..!", error.toString());
                    });
                },
                $scope.UpdateCharges = function(updatedcharges){
                    var charge = {
                         every_four_weeks : updatedcharges.every_four_weeks,
                         every_two_weeks  : updatedcharges.every_two_weeks,
                         one_time         : updatedcharges.one_time,
                         weekly           : updatedcharges.weekly,
                         cleaner_id       : updatedcharges.cleaner_id
                        }                    
                     ChargesService.UpdateCharges(updatedcharges.$id, charge).then(function (data) {                  
                     toaster.pop('success', "YOur charges Updated Successfully");
                     window.location = "#/cleaner_profiles/"+ authUser.uid+"/home-smile-cleaners";
                  
                });
                }

            }
        });  
    });