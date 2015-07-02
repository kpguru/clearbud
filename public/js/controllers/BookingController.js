'use strict';

	app.controller('BookingController', function ($scope, $window, $location, $http, ChargesService, BookingService, CleanerService, AuthenticationService, $firebase, toaster, FIREBASE_URL) { 
        $scope.signedIn = AuthenticationService.signedIn; 
        $scope.booking = true;
        $scope.bookInfo={};
        $scope.setStatus =0;
        $scope.bookingObj ={};
        $scope.completeBookInfo = {};
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
                $scope.submitOrder = function(){    
                    $scope.bookInfo.firstname = $scope.firstname;
                    $scope.bookInfo.lastname  =$scope.lastname;                                        
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
    });
