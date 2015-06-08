'use strict';

	app.controller('CleanerController', function ($routeParams, $http,$scope, $window, $location,AuthenticationService, CleanerService, $firebase, toaster, FIREBASE_URL) { 
        $scope.signedIn = AuthenticationService.signedIn;
        $scope.profile ={};
        var currentuser={};
        $scope.numbersOnly = /^\d+$/;
        var default_cleaner_logo= "";

      var ref = new Firebase(FIREBASE_URL);
        ref.onAuth(function(authUser) {
            if (authUser != null) {
              var users = AuthenticationService.getCurrentUser(authUser.uid);
                    users.$loaded().then(function (currentuser) { 
                      $scope.currentUser = currentuser;
                      default_cleaner_logo = currentuser.cleaner_logo;
                      $scope.profile.email = currentuser.email;
                      $scope.profile.phone = currentuser.phone;
                      get_states($scope.profile , 0);
              });           

           $scope.saveCleanerProfile = function(profile){ 
              if(!$scope.profile.firstname  || !$scope.profile.lastname ||!$scope.profile.zip_code){
                   return; 
              }  
              profile.cleaner_logo =  $scope.profile.logo; 
              CleanerService.createCP(authUser.uid, profile).then(function (data) {
                  toaster.pop('success', "Thank You for creating account.");
                  $location.path('/cleaner/'+authUser.uid+'/profile');
              });
           
           } 
            $scope.updateCP=function(cleaner){
               var logo = document.getElementById("newLogo").src;
               if(logo){                
                 cleaner.cleaner_logo = logo; 
               }else{
                 cleaner.cleaner_logo= default_cleaner_logo;
               }
               if(!$scope.currentUser.firstname  || !$scope.currentUser.lastname ||!$scope.currentUser.zip_code){
                  return; 
               }  
             
             CleanerService.updateCP(authUser.uid, cleaner).then(function (data) {                  
                  toaster.pop('success', "Thank You for Complete Your Profile,We Will get in touch soon");
                  $location.path('/cleaner/'+authUser.uid+'/profile');
              });
            }            
            $scope.steps = [
              'Personal Info',
              'Company Address',
              'Campaign Info',
              'submit'
            ];
            $scope.selection = $scope.steps[0];
            $scope.getCurrentStepIndex = function(){
              // Get the index of the current step given selection
              return _.indexOf($scope.steps, $scope.selection);
            };

            // Go to a defined step index
            $scope.goToStep = function(index) {
              if ( !_.isUndefined($scope.steps[index]) )
              {
                $scope.selection = $scope.steps[index];
              }
            };

            $scope.hasNextStep = function(){
              var stepIndex = $scope.getCurrentStepIndex();
              var nextStep = stepIndex + 1;
               if ( nextStep==4)
              {
               $scope.lastStep = true;
              }else{
                $scope.lastStep = false;
              }
           
              // Return true if there is a next step, false if not
              return !_.isUndefined($scope.steps[nextStep]);
            };

            $scope.hasPreviousStep = function(){
              var stepIndex = $scope.getCurrentStepIndex();
              var previousStep = stepIndex - 1;
              // Return true if there is a next step, false if not
              return !_.isUndefined($scope.steps[previousStep]);
            };  
            $scope.incrementStep = function() {             
              if ( $scope.hasNextStep() )
              {
                var stepIndex = $scope.getCurrentStepIndex();
                if(stepIndex == 2)
                {
                   var x = document.getElementById("newLogo").src;
                   $scope.profile.logo= x;
                }
                var nextStep = stepIndex + 1;
                $scope.selection = $scope.steps[nextStep];
              }
            };

            $scope.decrementStep = function() {
              if ( $scope.hasPreviousStep() )
              {
                var stepIndex = $scope.getCurrentStepIndex();
                var previousStep = stepIndex - 1;
                $scope.selection = $scope.steps[previousStep];
              }
            };
           
            }
          });
        function get_states(modelName, selected) {
          return $http.get('js/data/states.json').then(function (res) {
              modelName.state = '';
              $scope.states = res.data;
          });
    }

        });
