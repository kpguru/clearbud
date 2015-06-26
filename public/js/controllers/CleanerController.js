'use strict';

	app.controller('CleanerController', function ($routeParams, BookingService, CustomerService, RatingService, ServicesService, ChargesService, AvailabilitiesService, $http, $scope, $window, $location,AuthenticationService, CleanerService, $firebase, toaster, FIREBASE_URL) { 
      $scope.signedIn = AuthenticationService.signedIn;
      $scope.profile ={};
      var currentuser={};
      $scope.bookingInfo={};
      $scope.about ={};
      $scope.customerReviews = [];
      $scope.manageReviews =true;
      $scope.availabilities ={};
      $scope.services = {};
      $scope.no_of_bedrooms =CleanerService.No_of_bedRoom(); 
      $scope.bookingInfo.bedrooms = $scope.no_of_bedrooms[0].value;

      $scope.no_of_bathrooms = CleanerService.No_of_bathRoom();
      $scope.bookingInfo.bathrooms = $scope.no_of_bathrooms[0].value;

      $scope.frequency = CleanerService.frequency();
      $scope.bookingInfo.frequency_type = $scope.frequency[0].value;      
      $scope.numbersOnly = /^\d+$/;    
      $scope.steps = CleanerService.steps();
      $scope.steps1 = CleanerService.steps1();
      $scope.selection1 = $scope.steps1[0];        
      var ref = new Firebase(FIREBASE_URL);
        ref.onAuth(function(authUser) {
          if (authUser != null) {
            if($routeParams.cleanerID){ 
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
                 if(clanerAvailabilities[0]){                   
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
                }
                }); 
                
                var clanerCharges = ChargesService.getCharges($routeParams.cleanerID);
                clanerCharges.$loaded().then(function (data) { 
                    $scope.charges = data;
                    angular.forEach( $scope.charges, function(value){
                    $scope.chrg ={   
                                    every_four_weeks  : value.every_four_weeks,
                                    every_two_weeks   : value.every_two_weeks,
                                    one_time          : value.one_time,
                                    weekly            : value.weekly,
                                    $id               : value.$id,
                                    cleaner_id        :value.cleaner_id
                                   }
                    })
                });
                 
                var clanerRating = RatingService.getCleanerRatings($routeParams.cleanerID);
                clanerRating.$loaded().then(function (data) {
                  if(data.length > 0){
                    $scope.manageReviews = false;
                    var c = 0;
                    var a = 0
                    var sum = 0;
                    while(a<data.length){
                      angular.forEach(data[c].rating, function(value){
                        sum = sum + value.average_rating; 
                        var customerInfo = CustomerService.getCustomer(value.customer_id);                          
                        customerInfo.$asObject().$loaded().then(function (data) {
                          $scope.customerReviews.push({customer_review: value.customer_review, customer_image: data.customer_image, firstname: data.firstname, lastname: data.lastname, date: value.date, customer_average_rating: value.average_rating});
                        });
                        c++;
                      });
                      $scope.average_rating = Math.round(sum / c);
                      a++;
                    }
                  }
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
            $scope.setRendering =function(updateProfile){
              CleanerService.setRendering(updateProfile);
            };  
            $scope.getRendering =function(){  
              $scope.updateProfile = CleanerService.getRendering();
            };           
            $scope.updateCP=function(cleaner,updateProfile){
                var logo = document.getElementById("newLogo").src;                          
                cleaner.cleaner_logo = logo? logo : $scope.currentUser.cleaner_logo;
                if(!$scope.currentUser.firstname  || !$scope.currentUser.lastname ||!$scope.currentUser.zip_code ||!cleaner.cleaner_logo){
                    return; 
                }
                if(updateProfile == 'updateProfile')
                {
                  CleanerService.updateCP(authUser.uid, cleaner).then(function (data) {                  
                    toaster.pop('success', "Successfully Updated Your Profile");
                    $location.path('/cleaner_profiles/'+cleaner.$id);
                  });
                }
                else{
                  CleanerService.updateCP(authUser.uid, cleaner).then(function (data) {                  
                    toaster.pop('success', "Thank You for Complete Your Profile,We Will get in touch soon");
                    $location.path('/cleaner/'+authUser.uid+'/profile');
                  });
                }
                
            } 
             $scope.saveCleanerAbout = function(){             
              $scope.about.cleaner_about_us =  $scope.clanerProfile.cleaner_about_us;
                CleanerService.saveCleanerAbout(authUser.uid, $scope.about).then(function (data) {
                  toaster.pop('success', "Add Cleaner Aboutus Successfully.");
                });
            }
            $scope.getCurrentStepIndex1 = function(){
              return _.indexOf($scope.steps1, $scope.selection1);
            };
            $scope.goToStep1 = function(index) {
              if ( !_.isUndefined($scope.steps1[index]) ){
                $scope.selection1 = $scope.steps1[index];
              }
            };
            $scope.selection = $scope.steps[0];
            $scope.getCurrentStepIndex = function(){
              return _.indexOf($scope.steps, $scope.selection);
            };

            // Go to a defined step index
            $scope.goToStep = function(index) {
              if ( !_.isUndefined($scope.steps[index]) ){
                $scope.selection = $scope.steps[index];
              }
            };
            $scope.hasNextStep = function(){
              var stepIndex = $scope.getCurrentStepIndex();
              var nextStep = stepIndex + 1;
              $scope.lastStep = nextStep == 4 ? true :false;
              return !_.isUndefined($scope.steps[nextStep]);
            };

            $scope.hasPreviousStep = function(){
              var stepIndex = $scope.getCurrentStepIndex();
              var previousStep = stepIndex - 1;
              return !_.isUndefined($scope.steps[previousStep]);
            };

            $scope.incrementStep = function() {             
              if ( $scope.hasNextStep() ){
                var stepIndex = $scope.getCurrentStepIndex();
                if(stepIndex == 2){
                  var x = document.getElementById("newLogo").src;
                  $scope.profile.logo= x;
                }
                var nextStep = stepIndex + 1;
                $scope.selection = $scope.steps[nextStep];
              }
            };

            $scope.decrementStep = function() {
              if ( $scope.hasPreviousStep()){
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

