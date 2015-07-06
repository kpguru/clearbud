'use strict';

	app.controller('BookingController', function ($scope, $rootScope,SECRET_KEY, PUBLISH_KEY, $window, $location, $http, ChargesService, BookingService, CleanerService, AuthenticationService, $firebase, toaster, FIREBASE_URL) { 
        $scope.signedIn = AuthenticationService.signedIn; 
        $scope.booking = true;
        $scope.bookInfo={};
        $scope.token ='';
        $scope.payment={};
        $scope.setStatus =0;
        $scope.bookingObj ={};
        $scope.completeBookInfo = {};
        $scope.token= '';
        $scope.date = new Date();
        $scope.newAddress = true;
        $scope.time = CleanerService.formatTime(new Date());
        $scope.hours = BookingService.hours();
        $scope.reserve_hours = $scope.hours[0].value;
        var ref = new Firebase(FIREBASE_URL);
        ref.onAuth(function(authUser) {
            if (authUser != null) { 							    
                  var users = AuthenticationService.getCurrentUser(authUser.uid);
                    users.$loaded().then(function (currentuser) { 
                    $scope.currentUser = currentuser;
                }); 
                $scope.setBookInfo = function(bookingInfo){
                $scope.booking = true;                
                $scope.frequency1 =$scope.bookingInfo.frequency_type;
                var clanerProfile = AuthenticationService.getCurrentUser($scope.bookingInfo.cleanerId);
                    clanerProfile.$loaded().then(function (clanerProfile) { 
                    $scope.clanerProfile = clanerProfile;
                })
                var clanerCharges = ChargesService.getCharges($scope.bookingInfo.cleanerId);
                clanerCharges.$loaded().then(function (data) { 
                    $scope.charges = data;
                });    
                angular.forEach($scope.charges[0], function(key,value){
                    if($scope.frequency1 == value){
                      $scope.charges = key; 
                    }
                });

                $scope.bookInfo={
                   charges           : $scope.charges,
                   no_of_bedroom     : $scope.bookingInfo.bedrooms,
                   no_of_bathroom    : $scope.bookingInfo.bathrooms,
                   reserve_hours     : '3.0',                   
                   cleanerID         :$scope.bookingInfo.cleanerId,
                   cleaner_firstname :$scope.clanerProfile.firstname,
                   cleaner_lastname  :$scope.clanerProfile.lastname,
                };
               
                sessionStorage.user = null;
                sessionStorage.user = angular.toJson($scope.bookInfo);
                }
                var cleanerBookings = BookingService.getCleanerBookings(authUser.uid);
									   cleanerBookings.$loaded().then(function (data) { 
										 $scope.bookings = data;    
							 });
							 var allBookings = BookingService.all;
							       allBookings.$asArray().$loaded().then(function (data) { 
										 $scope.rejectedBooking = data;    
							 });
							 
                $scope.completeBooking = function(){
                    if(angular.isUndefined($scope.bookInfo.date_time)){
                        $scope.date = new Date();
                        $scope.bookInfo.date_time = $scope.date.getTime();
                    }
                    $scope.booking = false;
                }
                $scope.setHour = function(){
                    sessionStorage.user = null;
                    $scope.bookInfo.reserve_hours = $scope.reserve_hours;
                    sessionStorage.user = angular.toJson($scope.bookInfo);
                    $scope.subtotal = $scope.bookInfo.charges * $scope.reserve_hours;
                } 
                $scope.setCharge = function(charge){
                    sessionStorage.user = null;
                    $scope.bookInfo.charges = charge;
                    sessionStorage.user = angular.toJson($scope.bookInfo);
                    $scope.subtotal = charge * $scope.reserve_hours;
                }
                 $scope.setDateTime = function(date){
                    sessionStorage.user = null;
                    $scope.date_time = date.getTime();
                    $scope.bookInfo.date_time = $scope.date_time;
                    sessionStorage.user = angular.toJson($scope.bookInfo);
                }
                $scope.getBookInfo = function(){
                    $scope.bookInfo = JSON.parse(sessionStorage.user);
                    $scope.reserve_hours = $scope.bookInfo.reserve_hours;
                    $scope.subtotal = $scope.bookInfo.charges * $scope.bookInfo.reserve_hours;
                    get_states();
                }
                $scope.getCharges = function(){
                    var clanerCharges = ChargesService.getCharges($scope.bookInfo.cleanerID);
                    clanerCharges.$loaded().then(function (data) { 
                    $scope.charges = data;
                    });     
                }
							  
                  $scope.submit = function(){
									//	$scope.doPayment();
									  Stripe.setPublishableKey('pk_test_VkqhfDUwIQNyWJK4sR7CKVsY');							  
									  console.log($scope.number, $scope.exp_month, $scope.exp_year, $scope.cvc, $scope.name);
									  var token = Stripe.card.createToken({number: $scope.number, cvc:$scope.cvc, exp_month: $scope.exp_month, exp_year: $scope.exp_year}, stripeResponseHandler);
                    //$scope.token = token;
                    console.log($rootScope.token); 
                 }                 
                 $scope.submitOrder = function(charge){
									  $scope.bookInfo.paymentInfo  = charge;
									  console.log(JSON.parse(sessionStorage.user));
                    $scope.bookInfo.firstname  = $scope.firstname;                    
                    $scope.bookInfo.lastname   =$scope.lastname;                                        
                    $scope.bookInfo.total      =$scope.subtotal;
                    $scope.bookInfo.customerID =authUser.uid;
                    $scope.bookInfo.status     ="Pending" 
                    if($scope.previous_address == true){
                    $scope.bookInfo.address1 = $scope.currentUser.address1;
                    $scope.bookInfo.address2 =$scope.currentUser.address2;
                    $scope.bookInfo.city     =$scope.currentUser.city;
                    $scope.bookInfo.state    =$scope.currentUser.state;
                    $scope.bookInfo.zip_code =$scope.currentUser.zip_code;
                    }else{
                    $scope.bookInfo.address1   =$scope.address1;
                    $scope.bookInfo.address2   =$scope.address2;
                    $scope.bookInfo.city       =$scope.city;
                    $scope.bookInfo.state      =$scope.state;
                    $scope.bookInfo.zip_code   =$scope.zip_code;
                    }
                    BookingService.cleanerBooking($scope.bookInfo).then(function (data) {                        
                        sessionStorage.user = null;
                        $location.path('/customer_booking/submit_orders').replace();
                       toaster.pop('success', "Successfully generate Booking Order");
                    });
									}	
                 $scope.doPayment = function(token){
									var paymentinfo = {};
								    paymentinfo.token     = token;
                    paymentinfo.card      = $scope.number;
                    paymentinfo.exp_month = $scope.exp_month;
                    paymentinfo.exp_yearm = $scope.exp_year;
                    paymentinfo.cvc       = $scope.cvc;
                    paymentinfo.name      = $scope.name;
                    paymentinfo.amount    = $scope.subtotal;		
									$http.post('/dopayment', paymentinfo)
									.success(function(res){									
										if(res){
										 $scope.submitOrder(res);
										}
										else{
											alert('There is something went wrong !! ');
											}
									})
									.error(function(err){
										$rootScope.showLoading = false;
									});
								}
							
                $scope.setUserStatus = function(status){
									$scope.setStatus =status;
								} 
                $scope.setBookingStatus = function(bookingID, status){
									if($scope.setStatus == 0 ){
										 console.log(bookingID, status)
											$scope.bookingObj.status = status;
											BookingService.updateBookingStatus(bookingID,$scope.bookingObj).then(function(data){ 
												console.log(data, bookingID);
												toaster.pop('success', "Booking Approved Successfully");
											});
							    }else if($scope.setStatus == 1 ){
													$scope.bookingObj.status = status;
													BookingService.updateBookingStatus(bookingID,$scope.bookingObj).then(function(data){ 
														toaster.pop('success', "Booking Rejected Successfully");
													});
									  }
							  } 
							  $scope.acceptOpenBooking = function(bookingID, status){
									 console.log(bookingID, status, 'rejected');
									 $scope.bookingObj.status = status;
									 $scope.bookingObj.cleanerID =  $scope.currentUser.$id;
									 console.log($scope.currentUser.$id,  $scope.bookingObj.status);
									 BookingService.updateBookingStatus(bookingID,$scope.bookingObj).then(function(data){ 
										 toaster.pop('success', "Open Booking Accepted Successfully");
									});
						   }
					  }
            }); 
        function get_states() {
          return $http.get('js/data/states.json').then(function (res) {
              $scope.states = res.data;
          });
        }
        function stripeResponseHandler(status, response){
					var $form = $('#payment-form');
					if (response.error) {
						// Show the errors on the form
						$form.find('.payment-errors').text(response.error.message);
						$form.find('button').prop('disabled', false);
					} else {
						// response contains id and card, which contains additional card details
						var token = response.id;
						$rootScope.token = token;	
						console.log(token);
						 $scope.doPayment($rootScope.token);
         }
       }
    });
