'use strict';

	app.controller('CleanerController', function ($routeParams, BookingService, CustomerService, RatingService, ServicesService, ChargesService, AvailabilitiesService, $http, $scope, $window, $location,AuthenticationService, CleanerService, $firebase, toaster, FIREBASE_URL) { 
    $scope.signedIn = AuthenticationService.signedIn;
    $scope.profile ={};
    var currentuser={};
    $scope.about ={};
    $scope.customerReviews = [];
    $scope.manageReviews =true;
    $scope.availabilities ={};
    $scope.services = {};
		$scope.recipients ={};
    $scope.numbersOnly = /^\d+$/;    
    $scope.steps = CleanerService.steps();
    $scope.steps1 = CleanerService.steps1();
    $scope.selection1 = $scope.steps1[0];        
    var ref = new Firebase(FIREBASE_URL);
    $scope.bankinfo ={};
    ref.onAuth(function(authUser) {
      if (authUser != null) {
        if($routeParams.cleanerID){ 
          
          var clanerProfile = AuthenticationService.getCurrentUser($routeParams.cleanerID);
          clanerProfile.$loaded().then(function (clanerProfile) { 
            $scope.clanerProfile = clanerProfile;
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
              var c = 0;
              var flag = 0
              var sum = 0;
              angular.forEach(data, function(value1){
                if(value1.rating){
                  $scope.manageReviews = false;
                  angular.forEach(value1.rating, function(value){
                    sum = sum + parseInt(value.average_rating); 
                    var customerInfo = CustomerService.getCustomer(value.customer_id);                          
                    customerInfo.$asObject().$loaded().then(function (data) {
                      $scope.customerReviews.push({customer_review: value.customer_review, customer_image: data.customer_image, firstname: data.firstname, lastname: data.lastname, date: value.date, customer_average_rating: value.average_rating});
                    });
                    c++;
                    flag++;
                  })
                  $scope.average_rating = Math.round(sum / c);
                }
              });
              if(flag == 0){
                $scope.average_rating = 0;
              }
            }else{
               $scope.average_rating = 0;
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
        
        // this function manage update and save button on cleaner profile edit page 
        $scope.setManageCleanerProfileButton =function(updateProfile){
          CleanerService.setRendering(updateProfile);
        };
        
        // this function manage update and save button on cleaner profile edit page 
        $scope.getManageCleanerProfileButton =function(){  
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
        };
         
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
        $scope.submitInfo = function(account){
          Stripe.setPublishableKey('pk_test_VkqhfDUwIQNyWJK4sR7CKVsY');							  
          console.log($scope.bankinfo.number, $scope.bankinfo.exp_month, $scope.bankinfo.exp_year, $scope.bankinfo.cvc, $scope.bankinfo.name);
          var token = Stripe.card.createToken({number: $scope.bankinfo.number, cvc:$scope.bankinfo.cvc, exp_month: $scope.bankinfo.exp_month, exp_year: $scope.bankinfo.exp_year}, stripeResponseHandler);

          }  
        $scope.updateBankInfo= function(recInfo){
					   $scope.recipients.recipientInfo = recInfo;
					   console.log($scope.recipients.recipientInfo, authUser.uid);
             CleanerService.saveCleanerBankInfo(authUser.uid, $scope.recipients).then(function (data) {
             toaster.pop('success', "Add Bank Information SUccessfully");
          });
				 };    
        $scope.createRecipentID = function(token){
          var accountInfo = {};
            accountInfo.token     = token;
            accountInfo.card      = $scope.bankinfo.number;
            accountInfo.exp_month = $scope.bankinfo.exp_month;
            accountInfo.exp_yearm = $scope.bankinfo.exp_year;
            accountInfo.cvc       = $scope.bankinfo.cvc;
            accountInfo.email     = $scope.clanerProfile.email;
            accountInfo.name      =  $scope.bankinfo.name  ;	
						$http.post('/createRecipentID', accountInfo)
						.success(function(res){									
							if(res){		
								console.log(res);					
							  $scope.updateBankInfo(res);
							}
							else{
								alert('There is something went wrong !! ');
								}
						})
						.error(function(err){
							console.log(err);
						});
        }
             
        }
    });    
    function get_states(modelName, selected) {
      return $http.get('js/data/states.json').then(function (res) {
          modelName.state = '';
          $scope.states = res.data;
      });
    }
		function stripeResponseHandler(status, response){
			var $form = $('#payment-form');
			if (response.error) {
				$form.find('.payment-errors').text(response.error.message);
				$form.find('button').prop('disabled', false);
			} else {
				var token = response.id;	
				console.log(token);				
				 $scope.createRecipentID(token);
	}
   }
    
  });

