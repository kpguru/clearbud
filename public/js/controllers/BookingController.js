'use strict';

	app.controller('BookingController', function ($scope, $window, $location, $http, ChargesService, BookingService, CleanerService, AuthenticationService, $firebase, toaster, FIREBASE_URL) { 
        $scope.signedIn = AuthenticationService.signedIn; 
        $scope.booking = true;
        $scope.bookInfo={};
        $scope.completeBookInfo = {};
        $scope.date = new Date();
        $scope.newAddress = true;
        $scope.time = CleanerService.formatTime(new Date());
        $scope.hours = [{name: '3.0 hours', value: '3.0' },
                      {name: '3.5 hours', value: '3.5' },
                      {name: '4.0 hours', value: '4.0' },
                      {name: '4.5 hours', value: '4.5' },
                      {name: '5.0 hours', value: '5.0' }
                      ];
        $scope.reserve_hours = $scope.hours[0].value;
        var ref = new Firebase(FIREBASE_URL);
        ref.onAuth(function(authUser) {
            if (authUser != null) { 
                var users = AuthenticationService.getCurrentUser(authUser.uid);
                users.$loaded().then(function (currentuser) { 
                    $scope.currentUser = currentuser;
                });  
            	$scope.setBookInfo = function(bookingInfo){
                    console.log(bookingInfo);
                    $scope.booking = true;
                    $scope.bookInfo.no_of_bedroom =$scope.bookingInfo.bedrooms;
                    $scope.bookInfo.no_of_bathroom =$scope.bookingInfo.bathrooms;
                    $scope.bookInfo.reserve_hours ='3.0';
                    $scope.frequency1 =$scope.bookingInfo.frequency_type;
                    $scope.bookInfo.cleanerID = $scope.bookingInfo.cleanerId;
                    var clanerCharges = ChargesService.getCharges($scope.bookInfo.cleanerID);
                    clanerCharges.$loaded().then(function (data) { 
                        $scope.charges = data;
                    });    
                    angular.forEach($scope.charges[0], function(key,value){
                        if($scope.frequency1 == value){
                          $scope.bookInfo.charges = key; 
                        }
                    });
                    sessionStorage.user = null;
                    sessionStorage.user = angular.toJson($scope.bookInfo);
                }

                //complete booking
                $scope.completeBooking = function(){
                    $scope.booking = false;
                }

                //set hour on ng-change 
                $scope.setHour = function(){
                    sessionStorage.user = null;
                    $scope.bookInfo.reserve_hours = $scope.reserve_hours;
                    sessionStorage.user = angular.toJson($scope.bookInfo);
                    $scope.subtotal = $scope.bookInfo.charges * $scope.reserve_hours;
                }  

                // set charges on change charges
                $scope.setCharge = function(charge){
                    sessionStorage.user = null;
                    $scope.bookInfo.charges = charge;
                    sessionStorage.user = angular.toJson($scope.bookInfo);
                    $scope.subtotal = charge * $scope.reserve_hours;
                    // $scope.bookInfo.subtotal = $scope.subtotal;
                } 

                //set date and time on summary view 
                $scope.setDateTime = function(date){
                    sessionStorage.user = null;
                    $scope.date = CleanerService.formatDate(date);
                    $scope.time = CleanerService.formatTime(date);
                    $scope.bookInfo.date = $scope.date;
                    $scope.bookInfo.time = $scope.time;
                    sessionStorage.user = angular.toJson($scope.bookInfo);
                }

                //this fun call on loading of cleaner book page
                $scope.getBookInfo = function(){
                    $scope.bookInfo = JSON.parse(sessionStorage.user);
                    $scope.reserve_hours = $scope.bookInfo.reserve_hours;
                    if(angular.isUndefined($scope.bookInfo.date))
                    {
                        $scope.date = new Date();
                        $scope.time = CleanerService.formatTime(new Date());
                    }else{             
                        $scope.date = $scope.bookInfo.date;
                        $scope.time = $scope.bookInfo.time;
                     }
                     $scope.subtotal = $scope.bookInfo.charges * $scope.bookInfo.reserve_hours;
                     get_states();
                     // $scope.bookInfo.subtotal = $scope.subtotal;
                }

                //this fun call on loading of cleaner book page               
                $scope.getCharges = function(){
                    var clanerCharges = ChargesService.getCharges($scope.bookInfo.cleanerID);
                    clanerCharges.$loaded().then(function (data) { 
                        $scope.charges = data;
                    });     
                }

                //set previous address on booking page
                $scope.setPreviousAddress = function(){
                    $scope.newAddress = false;
                    $scope.completeBookInfo.firstname = $scope.firstname;
                    $scope.completeBookInfo.lastname = $scope.lastname;
                    $scope.completeBookInfo.charges = $scope.bookInfo.charges;
                    $scope.completeBookInfo.cleanerID = $scope.bookInfo.cleanerID;
                    $scope.completeBookInfo.no_of_bathroom = $scope.bookInfo.no_of_bathroom;
                    $scope.completeBookInfo.no_of_bedroom = $scope.bookInfo.no_of_bedroom;
                    $scope.completeBookInfo.reserve_hours = $scope.bookInfo.reserve_hours;
                    $scope.completeBookInfo.date = $scope.bookInfo.date;
                    $scope.completeBookInfo.time = $scope.bookInfo.time;
                    $scope.completeBookInfo.address1 = $scope.currentUser.address1;
                    $scope.completeBookInfo.address2 = $scope.currentUser.address2;
                    $scope.completeBookInfo.city = $scope.currentUser.city;
                    $scope.completeBookInfo.state = $scope.currentUser.state;
                    $scope.completeBookInfo.zip_code = $scope.currentUser.zip_code;
                    $scope.completeBookInfo.total = $scope.subtotal;
                    $scope.completeBookInfo.customerID = authUser.uid;

                }
                //set new address on booking page
                $scope.setNewAddress = function(){
                    $scope.newAddress = true;
                }
                //submit order from customer
                $scope.submitOrder = function(){
                    if($scope.newAddress){
                        $scope.bookInfo.firstname = $scope.firstname;
                        $scope.bookInfo.lastname = $scope.lastname;
                        $scope.bookInfo.address1 = $scope.address1;
                        $scope.bookInfo.address2 = $scope.address2;
                        $scope.bookInfo.city = $scope.city;
                        $scope.bookInfo.state = $scope.state;
                        $scope.bookInfo.zip_code = $scope.zip_code; 
                        $scope.bookInfo.total = $scope.subtotal;
                        $scope.bookInfo.customerID = authUser.uid;
                        console.log($scope.bookInfo);
                        BookingService.cleanerBooking($scope.bookInfo).then(function (data) {
                           toaster.pop('success', "Successfully generate Booking Order");
                        });
                    }else{
                        console.log($scope.completeBookInfo);
                        BookingService.cleanerBooking($scope.completeBookInfo).then(function (data) {
                           toaster.pop('success', "Successfully generate Booking Order");
                        });
                    }
                }
            }
        });  
        function get_states() {
          return $http.get('js/data/states.json').then(function (res) {
              $scope.states = res.data;
          });
        }
    });