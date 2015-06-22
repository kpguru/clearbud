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
                $scope.booking = true;                
                $scope.frequency1 =$scope.bookingInfo.frequency_type;
                // $scope.bookInfo.no_of_bedroom =$scope.bookingInfo.bedrooms;
                // $scope.bookInfo.no_of_bathroom =$scope.bookingInfo.bathrooms;
                // $scope.bookInfo.reserve_hours ='3.0';
                // $scope.frequency1 =$scope.bookingInfo.frequency_type;
                // $scope.bookInfo.cleanerID = $scope.bookingInfo.cleanerId;
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
                      $scope.bookInfo.charges = key; 
                    }
                });
                $scope.bookInfo={
                   no_of_bedroom     : $scope.bookingInfo.bedrooms,
                   no_of_bathroom    : $scope.bookingInfo.bathrooms,
                   reserve_hours     : '3.0',                   
                   cleanerID         :$scope.bookingInfo.cleanerId,
                   cleaner_firstname :$scope.clanerProfile.firstname,
                   cleaner_lastname  :$scope.clanerProfile.lastname,
                };
               
                sessionStorage.user = null;
                sessionStorage.user = angular.toJson($scope.bookInfo);
                console.log($scope.bookInfo);
                }
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

                    // $scope.bookInfo.subtotal = $scope.subtotal;
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
                    $scope.bookInfo.total      =$scope.subtotal ? $scope.subtotal : '0';
                    $scope.bookInfo.customerID =authUser.uid;
                    $scope.bookInfo.status     ="In progress"                   
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
                    console.log($scope.bookInfo);  
                    BookingService.cleanerBooking($scope.bookInfo).then(function (data) {                        
                        sessionStorage.user = null;
                        $location.path('/customer_booking/submit_orders').replace();
                       toaster.pop('success', "Successfully generate Booking Order");
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