'use strict';

	app.controller('CleanerController', function ($routeParams, BookingService, ServicesService, ChargesService, AvailabilitiesService, $http, $scope, $window, $location,AuthenticationService, CleanerService, $firebase, toaster, FIREBASE_URL) { 
      $scope.signedIn = AuthenticationService.signedIn;
      $scope.profile ={};
      var currentuser={};
      $scope.bookingInfo={};
      $scope.about ={};
      $scope.availabilities ={};
      $scope.services = {};
      $scope.services.general = []; 
      $scope.services.bathroom = [];
      $scope.services.bedroom = [];
      $scope.services.livingArea = [];
      $scope.sunday = {}; 
      $scope.monday = {};
      $scope.tuesday = {};
      $scope.wednesday = {};
      $scope.thusday = {}; 
      $scope.friday = {};
      $scope.saturday = {};
      $scope.everyday = {};
      $scope.weekends = {}; 
      $scope.montofri = {};

      $scope.no_of_bedrooms = [{name: '1 Bedroom', value: '1 Bedroom' },
                      {name: '2 Bedroom', value: '2 Bedroom' },
                      {name: '3 Bedroom', value: '3 Bedroom' },
                      {name: '4 Bedroom', value: '4 Bedroom' },
                      {name: '5 Bedroom', value: '5 Bedroom' }
                      ];
      $scope.bookingInfo.bedrooms = $scope.no_of_bedrooms[0].value;

      $scope.no_of_bathrooms = [{name: '1 Bathroom', value: '1 Bathroom' },
                      {name: '2 Bathroom', value: '2 Bathroom' },
                      {name: '3 Bathroom', value: '3 Bathroom' },
                      {name: '4 Bathroom', value: '4 Bathroom' }
                      ];
      $scope.bookingInfo.bathrooms = $scope.no_of_bathrooms[0].value;

      $scope.frequency = [{name: 'Weekly', value: 'weekly' },
                      {name: 'Every 2 Weekly', value: 'every_two_weeks' },
                      {name: 'Every 4 Weeks', value: 'every_four_weeks' },
                      {name: 'One Time', value: 'one_time' }
                      ];
      $scope.bookingInfo.frequency_type = $scope.frequency[0].value;
      
      $scope.numbersOnly = /^\d+$/;
      $scope.editorOptions = {
            language: 'ru',
            uiColor: '#000000'
      };
      $scope.steps1 = [
              "Reviews",
              "About",
              "What's Included",
              'Pricing',
              'Availability'
            ];
      $scope.selection1 = $scope.steps1[0];
        
      var ref = new Firebase(FIREBASE_URL);
        ref.onAuth(function(authUser) {
          if (authUser != null) {

            //get cleaner availabilities,charges,services,profile
            if($routeParams.cleanerID)
            {
               var clanerProfile = AuthenticationService.getCurrentUser($routeParams.cleanerID);
               clanerProfile.$loaded().then(function (clanerProfile) { 
                $scope.clanerProfile = clanerProfile;
                $scope.bookingInfo.cleanerId = $scope.clanerProfile.$id;
                if(angular.isUndefined($scope.clanerProfile.cleaner_about_us))                    
                   $scope.save =true;
                else
                   $scope.update =true;
                });    
                var clanerAvailabilities = AvailabilitiesService.getCleanerAvailabilities($routeParams.cleanerID);
                 clanerAvailabilities.$loaded().then(function (data) { 
                  $scope.Availabilities = clanerAvailabilities[0]; 
                  $scope.sunday = clanerAvailabilities[0].sunday;
                  $scope.monday = clanerAvailabilities[0].monday;
                  $scope.tuesday = clanerAvailabilities[0].tuesday;
                  $scope.wednesday = clanerAvailabilities[0].wednesday;
                  $scope.thusday = clanerAvailabilities[0].thusday;
                  $scope.friday = clanerAvailabilities[0].friday;
                  $scope.saturday = clanerAvailabilities[0].saturday;
                  $scope.everyday = clanerAvailabilities[0].everyday;
                  $scope.weekends = clanerAvailabilities[0].weekends;                  
                  $scope.montofri = clanerAvailabilities[0].monday_to_friday;
                }); 

                var clanerCharges = ChargesService.getCharges($routeParams.cleanerID);
                clanerCharges.$loaded().then(function (data) { 
                    $scope.charges = data;
                    angular.forEach( $scope.charges, function(value){
                        $scope.charges.every_four_weeks  = value.every_four_weeks;
                        $scope.charges.every_two_weeks   = value.every_two_weeks;
                        $scope.charges.one_time          = value.one_time;
                        $scope.charges.weekly            = value.weekly;
                        $scope.charges.$id               = value.$id;
                        $scope.charges.cleaner_id       = value.cleaner_id;

                    })
                });  

                var cleanerService = ServicesService.getServices($routeParams.cleanerID);
                cleanerService.$loaded().then(function (data) { 
                    $scope.services = data;
                    $scope.serviceID = $scope.services[0].$id;
                    $scope.cleanerID = $scope.services[0].cleaner_id;
                    $scope.generalServices = $scope.services[0].general[0];
                    $scope.bathroomServices = $scope.services[0].bathroom[0];
                    $scope.bedroomServices = $scope.services[0].bedroom[0];
                    $scope.livingAreaServices = $scope.services[0].livingArea[0];  
                });  
            }
                
            var users = AuthenticationService.getCurrentUser(authUser.uid);
              users.$loaded().then(function (currentuser) { 
                $scope.currentUser = currentuser;
                $scope.profile.email = currentuser.email;
                $scope.profile.phone = currentuser.phone;
                get_states($scope.profile , 0);
              });

            $scope.saveCleanerProfile = function(profile){ 
              if(!$scope.profile.firstname  || !$scope.profile.lastname ||!$scope.profile.zip_code){
                return; 
              }  
              profile.cleaner_logo =  $scope.profile.logo; 
              delete $scope.profile.logo;
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
                  cleaner.cleaner_logo= $scope.currentUser.cleaner_logo;
               }
               if(!$scope.currentUser.firstname  || !$scope.currentUser.lastname ||!$scope.currentUser.zip_code ||!cleaner.cleaner_logo){
                  return; 
               }  
               
              CleanerService.updateCP(authUser.uid, cleaner).then(function (data) {                  
                toaster.pop('success', "Thank You for Complete Your Profile,We Will get in touch soon");
                $location.path('/cleaner/'+authUser.uid+'/profile');
              });
            } 
             $scope.saveCleanerAbout = function(){             
              $scope.about.cleaner_about_us =  $scope.clanerProfile.cleaner_about_us;
                CleanerService.saveCleanerAbout(authUser.uid, $scope.about).then(function (data) {
                  toaster.pop('success', "Add Cleaner Aboutus Successfully.");
                });
            }
            $scope.getCurrentStepIndex1 = function(){
              // Get the index of the current step given selection
              return _.indexOf($scope.steps1, $scope.selection1);
            };

            // Go to a defined step index
            $scope.goToStep1 = function(index) {
              if ( !_.isUndefined($scope.steps1[index]) )
              {
                $scope.selection1 = $scope.steps1[index];
              }
            };

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

