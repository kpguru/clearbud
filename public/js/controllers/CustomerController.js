'use strict';

	app.controller('CustomerController', function ($scope, $http, $window, $location, RatingService, BookingService, AuthenticationService, CustomerService, CleanerService,$firebase, toaster, FIREBASE_URL) { 
        $scope.signedIn = AuthenticationService.signedIn;
        get_states();
        $scope.bookings = {};
        $scope.booking_status = {};
        $scope.steps = [
                        'Appointments',
                        'Account'
                       ];
        $scope.selection = $scope.steps[0];

        //search cleaner by name
        $scope.searchCleanerByName = function(name){
          CleanerService.getCleanerByName(name).$loaded().then(function(data){
            $scope.cleanerData = data;
          });
        } 

        var ref = new Firebase(FIREBASE_URL);
        ref.onAuth(function(authUser) {
            if(authUser != null) {

                //get all booking according to customer id
                var customerBookings = BookingService.getCustomerBookings(authUser.uid);
                customerBookings.$loaded().then(function (data) { 
                    $scope.bookings = data;
                    //manage appointment tab through isAppointment
                    $scope.isAppointment = true;
                    angular.forEach($scope.bookings, function(value , key) {
                       if(value.status == "In Progress"){
                         $scope.isAppointment = false;
                       };
                    })
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

                //set booking details when click on view button into Customerservice
                $scope.setBooking = function(booking){
                    CustomerService.setBooking(booking);
                };

                //get booking details when load show booking page
                $scope.getBooking = function(){
                    $scope.booking = CustomerService.getBooking();
                };

                //save rating page
                $scope.saveRating = function(rating){
                    $scope.booking = CustomerService.getBooking();
                    rating.cleaner_id = $scope.booking.cleanerID;
                    rating.customer_id = $scope.booking.customerID;
                    rating.booking_id = $scope.booking.$id;
                    var ratingSum = rating.communication_rating + rating.friendliness_rating + rating.punctuality_rating + rating.quality_rating + rating.recommend_rating + rating.value_rating;
                    rating.avrage_rating =  Math.round(ratingSum / 6);
                    RatingService.addCustomersRating(rating).then(function() {
                        toaster.pop('success', "successfully add rating!");
                        window.location = "#/customer-dashboard";
                    },function (error) {
                        toaster.pop('error', "Error..!", error.toString());
                    });;
                };

                //update booking status 
                $scope.updateBookingStatus = function(booking){
                    CustomerService.setBooking(booking);
                    $scope.booking_status.status = "complete";
                    BookingService.updateBookingStatus(booking.$id,$scope.booking_status);
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