'use strict';

	app.controller('CustomerController', function ($scope, $http, $window, $location, AvailabilitiesService, ChargesService, RatingService, BookingService, AuthenticationService, CustomerService, CleanerService,$firebase, toaster, FIREBASE_URL) { 
        $scope.signedIn = AuthenticationService.signedIn;
        get_states();
        $scope.bookings = {};
        $scope.cleanerData = [];
        $scope.booking_status = {};
        $scope.steps = [
                        'Appointments',
                        'Account'
                       ];
        $scope.selection = $scope.steps[0];

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
                       if(value.status == "In progress"){
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
                }
                //sort by price
                $scope.setCleanerSearch = function(booleanValue){
                    $scope.manageCleanerSearch = booleanValue;
                }
                //get all cleaners profile like name, availabilities, rating, charge on search page
                $scope.getCleanersProfile = function(){
                    $scope.manageCleanerSearch = true;
                    AuthenticationService.getUsersByRole('cleaner').$loaded().then(function(data){
                        $scope.cleaners = data;
                        var i = 0;
                        angular.forEach( $scope.cleaners, function(cleaner){                       
                            var clanerCharges = ChargesService.getCharges(cleaner.$id);
                            clanerCharges.$loaded().then(function (charges) {                   
                                var clanerAvailabilities = AvailabilitiesService.getCleanerAvailabilities(cleaner.$id);
                                clanerAvailabilities.$loaded().then(function (availabilities) {                      
                                    var clanerRating = RatingService.getCleanerRatings(cleaner.$id);
                                    clanerRating.$loaded().then(function (rating) {
                                        if(rating.length > 0){
                                            var c = 0;
                                            var sum = 0;
                                            angular.forEach( rating, function(value){
                                                sum = sum + value.average_rating; 
                                                c++;
                                            });
                                            $scope.average_rating = Math.round(sum / c); 
                                        }                         
                                        $scope.cleanerData.push({firstname:cleaner.firstname,lastname:cleaner.lastname,cleaner_id:cleaner.$id,isApproved:cleaner.isApproved,cleaner_logo:cleaner.cleaner_logo,cleaner_charge:charges[i].one_time,cleaner_availabilities:availabilities,cleaner_raing:$scope.average_rating});                
                                        CustomerService.setData($scope.cleanerData);
                                    });
                                });
                            });
                        });
                    });
                }; 

                //save rating page
                $scope.saveRating = function(rating){
                    $scope.booking = CustomerService.getData();
                    rating.cleaner_id = $scope.booking.cleanerID;
                    rating.customer_id = $scope.booking.customerID;
                    rating.booking_id = $scope.booking.$id;
                    var ratingSum = rating.communication_rating + rating.friendliness_rating + rating.punctuality_rating + rating.quality_rating + rating.recommend_rating + rating.value_rating;
                    rating.average_rating =  Math.round(ratingSum / 6);
                    RatingService.addCustomersRating(rating).then(function() {
                        toaster.pop('success', "successfully add rating!");
                        window.location = "#/customer-dashboard";
                    },function (error) {
                        toaster.pop('error', "Error..!", error.toString());
                    });;
                };

                //update booking status 
                $scope.updateBookingStatus = function(booking){
                    CustomerService.setData(booking);
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