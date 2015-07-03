'use strict';

	app.controller('CustomerController', function ($scope, $http, $window, $filter, $location, AvailabilitiesService, ChargesService, RatingService, BookingService, AuthenticationService, CustomerService, CleanerService,$firebase, toaster, FIREBASE_URL) { 
    $scope.signedIn = AuthenticationService.signedIn;
    get_states();
    $scope.bookings = [];
    $scope.cleanerData = [];
    $scope.booking_status = {};
    $scope.isAppointment = true;
    $scope.steps = [
                    'Appointments',
                    'Account'
                   ];
    $scope.selection = $scope.steps[0];
    var date = new Date();
    $scope.timestampDate = date.getTime();
    $scope.currentDate = $filter('date')(date, 'MM/dd/yyyy');
    $scope.bookingDate = $scope.currentDate;

    var ref = new Firebase(FIREBASE_URL);
    ref.onAuth(function(authUser) {
      if(authUser != null) {
        
        //get all booking according to customer id
        var customerBookings = BookingService.getCustomerBookings(authUser.uid);
            customerBookings.$loaded().then(function (data) { 
            $scope.bookings = data;
            if($scope.bookings.length > 0){
              $scope.isAppointment = false;
            }else{
              $scope.isAppointment = true;
             }
          });
        //get current user
        var users = AuthenticationService.getCurrentUser(authUser.uid);
        users.$loaded().then(function (data) {
          $scope.currentUser = data;
        });

        //customer edit profile
        $scope.customer_edit = function(customer){
          if(!customer.firstname  || !customer.lastname ||!customer.zip_code){
            return; 
          }
          if(angular.isUndefined($scope.currentUser.customer_image) && angular.isUndefined($scope.image)){
            toaster.pop('error', "Select Customer Photo!");
            return;
          }
          var data ={
            firstname      : customer.firstname,
            lastname       : customer.lastname,
            phone          : customer.phone,
            address1       : customer.address1,
            address2       : customer.address2,
            city           : customer.city,
            state          : customer.state,
            zip_code       : customer.zip_code,
            customer_image : $scope.image ? $scope.image.resized.dataURL : $scope.currentUser.customer_image
          } 
          CustomerService.updateCustomer($scope.currentUser.$id,data).then(function() {
            toaster.pop('success', "Update successfully!");
            window.location = "#/customer-dashboard";
          },function (error) {
            toaster.pop('error', "Error..!", error.toString());
          });
        };

        //set booking details when click on complete button into Customer dashboard
        $scope.setBooking = function(booking){
          CustomerService.setData(booking);
        };

        //get booking details when load show booking page
        $scope.getBooking = function(){
          $scope.booking = CustomerService.getData();
        };

        //search cleaner by name
        $scope.searchCleanerByName = function(name){
          if(name){
            $scope.cleanerData = [];
            $scope.cleaners = CustomerService.getData();
            angular.forEach( $scope.cleaners, function(cleaner){
              if(cleaner.firstname ==  name)
              {
                 $scope.cleanerData.push(cleaner); 
              }
            });
          }else{
              $scope.getCleanersProfile();
          }
        };
        
        //sort by price
        $scope.setCleanerSearch = function(booleanValue){
          //manageCleanerSearch var manage price and default wise cleaner
          $scope.manageCleanerSearch = booleanValue;
        };
        
        //get all cleaners profile like name, availabilities, rating, charge on search page
        $scope.getCleanersProfile = function(){
          $scope.manageCleanerSearch = 0;
          AuthenticationService.getUsersByRole('cleaner').$loaded().then(function(data){
            $scope.cleaners = data;
            var i = 0;
            angular.forEach( $scope.cleaners, function(cleaner){                       
              var clanerCharges = ChargesService.getCharges(cleaner.$id);
              clanerCharges.$loaded().then(function (charges) {
                if(charges[0]){                 
                  var clanerAvailabilities = AvailabilitiesService.getCleanerAvailabilities(cleaner.$id);
                  clanerAvailabilities.$loaded().then(function (availabilities) { 
                    var clanerRating = RatingService.getCleanerRatings(cleaner.$id);
                    clanerRating.$loaded().then(function (data) {
                      if(data.length > 0){
                        var c = 0;
                        var r = 0;
                        $scope.average_rating = 0;
                        var sum = 0;
                        angular.forEach(data, function(value){
                          if(value.rating){
                            angular.forEach(value.rating, function(value1){
                              sum = sum + parseInt(value1.average_rating); 
                              c++;
                            })
                          }
                        });
                        $scope.average_rating = Math.round(sum / c); 
                        r++;
                      }
                      if(Number.isNaN($scope.average_rating))
                      {
                         $scope.average_rating = 0;
                      }
                      $scope.cleanerData.push({score:cleaner.score,firstname:cleaner.firstname,lastname:cleaner.lastname,cleaner_id:cleaner.$id,isApproved:cleaner.isApproved,cleaner_logo:cleaner.cleaner_logo,cleaner_charge:charges[0].one_time,cleaner_availabilities:availabilities,cleaner_rating:$scope.average_rating});                
                      CustomerService.setData($scope.cleanerData);
                    });
                  });
                }
              });
            });
          });
        }; 

        //save rating page and set booking status is completed ang get each booking get 5 score to cleaner 
        $scope.saveRating = function(rating){
          $scope.booking = CustomerService.getData();
          rating.cleaner_id = $scope.booking.cleanerID;
          rating.customer_id = $scope.booking.customerID;
          rating.booking_id = $scope.booking.$id;
          var ratingSum = rating.communication_rating + rating.friendliness_rating + rating.punctuality_rating + rating.quality_rating + rating.recommend_rating + rating.value_rating;
          rating.average_rating =  Math.round(ratingSum / 6);
          RatingService.addCustomersRating(rating).then(function() {
             CleanerService.getCleaner($scope.booking.cleanerID).$asObject().$loaded().then(function(data){ 
                  $scope.status = "Completed";
                  $scope.final_status = {status: $scope.status};           
                  $scope.final_score = data.score + 5;
                  $scope.score = {score : $scope.final_score}; 
                  CleanerService.saveScore($scope.booking.cleanerID, $scope.score);
                  BookingService.updateBookingStatus($scope.booking.$id, $scope.final_status).then(function() {
                  },function (error) {
                    toaster.pop('error', "Error..!", error.toString());
                  });
              });
            toaster.pop('success', "successfully add rating!");
            window.location = "#/customer-dashboard";
          },function (error) {
            toaster.pop('error', "Error..!", error.toString());
          });;
        };
        //get booking by date 
        $scope.getBookingByDate = function(date){
          $scope.bookings = [];
          $scope.search_date = $filter('date')(date, 'MM/dd/yyyy');
          customerBookings.$loaded().then(function (data) { 
            angular.forEach(data, function(value){
              var booking_date = $filter('date')(value.date_time, 'MM/dd/yyyy');
                if(booking_date == $scope.search_date){
                  $scope.bookings.push(value);
                }
            });
            if(data.length > 0){
              $scope.isAppointment = false;
            }else{
              $scope.isAppointment = true;
             }
          });
        };
        // Get the index of the current step given selection
        $scope.getCurrentStepIndex = function(){
          return _.indexOf($scope.steps, $scope.selection);
        };

        // Go to a defined step index
        $scope.goToStep = function(index) {
          if ( !_.isUndefined($scope.steps[index]) )
          {
            $scope.selection = $scope.steps[index];
          }
        }; 
      }              
    });

    //get states
    function get_states() {
      return $http.get('js/data/states.json').then(function (res) {
        $scope.states = res.data;
      });
    }
  });
