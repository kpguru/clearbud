'use strict';

  app.controller('ServicesController', function ($scope, ServicesService, AuthenticationService, firebase, toaster, FIREBASE_URL) { 
    $scope.signedIn = AuthenticationService.signedIn; 
    $scope.services = {};
    $scope.services.general = []; 
    $scope.services.bathroom = [];
    $scope.services.bedroom = [];
    $scope.services.livingArea = [];
      
    var ref = new Firebase(FIREBASE_URL);
    ref.onAuth(function(authUser) {
      if (authUser != null) { 
        $scope.saveServices = function(){
          $scope.services.cleaner_id = authUser.uid;
          $scope.services.general.push($scope.generalServices);
          $scope.services.bathroom.push($scope.bathroomServices);
          $scope.services.bedroom.push($scope.bedroomServices);
          $scope.services.livingArea.push($scope.livingAreaServices);
          
          ServicesService.addCleanerServices($scope.services).then(function(data) {
            toaster.pop('success', "Add Cleaner Services Successfully!");
          },function (data) {
            toaster.pop('error', "Error..!", error.toString());
          });
        }
        
        $scope.updateServices= function(){
          $scope.services.cleaner_id = authUser.uid;  
          $scope.services.general.push($scope.generalServices);
          $scope.services.bathroom.push($scope.bathroomServices);
          $scope.services.bedroom.push($scope.bedroomServices);
          $scope.services.livingArea.push($scope.livingAreaServices);
          ServicesService.updateCleanerServices($scope.serviceID,$scope.services).then(function(data) {
            toaster.pop('success', "Update Cleaner Services Successfully!");
          },function (data) {
            toaster.pop('error', "Error..!", error.toString());
          });
        }
      }
    });  
  });
