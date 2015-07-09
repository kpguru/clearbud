'use strict';
  app.controller('BookingController', function ($scope, $routeParams, $window, $location, $http, AvailabilitiesService, ChargesService, CustomerService, BookingService, CleanerService, AuthenticationService, $firebase, toaster, FIREBASE_URL) { 
    $scope.signedIn = AuthenticationService.signedIn; 
    $scope.final_booking = true;
    $scope.bookInfo={};
    $scope.setStatus =0;
    $scope.token ='';
    $scope.payment={};
    $scope.flag = 0;
    $scope.bookingObj ={};
    $scope.cleaners = [];
    $scope.bookingInfo = {};
    $scope.completeBookInfo = {};
    $scope.date = new Date();
    $scope.timestampDate = $scope.date.getTime() - 1*24*60*60*1000;
    $scope.newAddress = true;    
    $scope.recID='';
    $scope.time = CleanerService.formatTime(new Date());
    $scope.hours = BookingService.hours();
    $scope.reserve_hours = $scope.hours[0].value;
    $scope.no_of_bedrooms =CleanerService.No_of_bedRoom();
    $scope.bookingInfo.bedrooms = $scope.no_of_bedrooms[0].value;
    $scope.no_of_bathrooms = CleanerService.No_of_bathRoom();
    $scope.bookingInfo.bathrooms = $scope.no_of_bathrooms[0].value;
    $scope.frequency = CleanerService.frequency();
    $scope.bookingInfo.frequency_type = $scope.frequency[0].value; 
					
    var ref = new Firebase(FIREBASE_URL);
    ref.onAuth(function(authUser) {
      if (authUser != null) { 
							
        //get current user
        var users = AuthenticationService.getCurrentUser(authUser.uid);
        users.$loaded().then(function (currentuser) { 
          $scope.currentUser = currentuser;
        }); 
        
        //show bookings cleaner open and show booking page on cleaner hand     
        var cleanerBookings = BookingService.getCleanerBookings(authUser.uid);
          cleanerBookings.$loaded().then(function (data) { 
          $scope.bookings = data;   
        });        
        //show rejected booking on cleaner hand      
        var allBookings = BookingService.all;
          allBookings.$asArray().$loaded().then(function (data) { 
          $scope.rejectedBooking = data;    
        });

        //if user click book now button on customer cleaner page set book info 
        $scope.setBookInfo = function(bookingInfo,reschedule){
          BookingService.setRescheduleBooking(reschedule);
          $scope.final_booking = true;
          if(reschedule){
            $scope.frequency1 =$scope.bookingInfo.frequency_type;
            var clanerProfile = AuthenticationService.getCurrentUser($routeParams.cleanerID);
            clanerProfile.$loaded().then(function (clanerProfile) { 
            $scope.clanerProfile = clanerProfile;
            })
            var clanerCharges = ChargesService.getCharges($routeParams.cleanerID);
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
              cleanerID         :$routeParams.cleanerID,
              cleaner_firstname :$scope.clanerProfile.firstname,
              cleaner_lastname  :$scope.clanerProfile.lastname,
            };
            sessionStorage.user = null;
            sessionStorage.user = angular.toJson($scope.bookInfo);
            $location.path('/cleaner_profiles/home-smile-cleaners/orders/new').replace();
          }else{
             $scope.bookInfo={
               charges           : bookingInfo.charges,
               no_of_bedroom     : bookingInfo.no_of_bedroom,
               no_of_bathroom    : bookingInfo.no_of_bathroom,
               reserve_hours     : bookingInfo.reserve_hours,                   
               cleanerID         : bookingInfo.cleanerID,
               cleaner_firstname : bookingInfo.cleaner_firstname,
               cleaner_lastname  : bookingInfo.cleaner_lastname,
               firstname         : bookingInfo.firstname,
               lastname          : bookingInfo.lastname,
               address1          : bookingInfo.address1,
               address2          : bookingInfo.address2,
               city              : bookingInfo.city,
               state             : bookingInfo.state,
               zip_code          : bookingInfo.zip_code,
               phone             : bookingInfo.phone,
               date_time         : bookingInfo.date_time,
               paymentInfo       : bookingInfo.paymentInfo
             };
             sessionStorage.user = null;
             sessionStorage.user = angular.toJson($scope.bookInfo);
           }
        };
							
        // this function call when click on next button on booing page
        $scope.completeBooking = function(){
          if(!$scope.reschedule){
            $scope.bookInfo = JSON.parse(sessionStorage.user);
            $scope.firstname = $scope.bookInfo.firstname;
            $scope.lastname  = $scope.bookInfo.lastname;
            $scope.address1  = $scope.bookInfo.address1;
            $scope.address2  = $scope.bookInfo.address2;
            $scope.city      = $scope.bookInfo.city;
            $scope.state     = $scope.bookInfo.state;
            $scope.zip_code  = $scope.bookInfo.zip_code;
            $scope.phone     = $scope.bookInfo.phone;
            if($scope.flag == 1)
            {
              $scope.final_booking = false;
            }else{
               $scope.final_booking = true;
               toaster.pop('error', "Please Select Cleaner Charges");
             }
          }else{                
            if(angular.isUndefined($scope.bookInfo.date_time)){
              $scope.date = new Date();
              $scope.bookInfo.date_time = $scope.date.getTime();
              $scope.final_booking = false;
            }else{
              $scope.final_booking = false;
              }
           }
        };
        
        // this function call when select hour on booking and reschedule booking page
        $scope.setHour = function(){
          sessionStorage.user = null;
          $scope.bookInfo.reserve_hours = $scope.reserve_hours;
          sessionStorage.user = angular.toJson($scope.bookInfo);
          $scope.subtotal = $scope.bookInfo.charges * $scope.reserve_hours;
        };
        
        // this function call when select charges on booking and reschedule booking page
        $scope.setCharge = function(charge){
          if(!$scope.reschedule){
            $scope.flag = 1;
          }
          sessionStorage.user = null;
          $scope.bookInfo.charges = charge;
          sessionStorage.user = angular.toJson($scope.bookInfo);
          $scope.subtotal = charge * $scope.reserve_hours;
        };
        
        // this function call when load booking and reschedule booking page
        $scope.getCharges = function(cleaner_id){
          var clanerCharges = ChargesService.getCharges(cleaner_id);
          clanerCharges.$loaded().then(function (data) { 
            $scope.charges = data;
          }); 
        };

        // this function call when select no of bathroom and bedroom on reschedule booking page
        $scope.setServices = function(services,status){
          sessionStorage.user = null;
          if(status == "bedroom"){
            $scope.bookInfo.no_of_bedroom =  services;
          }else{
            $scope.bookInfo.no_of_bathroom =  services;
           }
           sessionStorage.user = angular.toJson($scope.bookInfo);
        };
        
        // this function call when select date and time on booking and reschedule booking page
        $scope.setDateTime = function(date){
          sessionStorage.user = null;
          $scope.date = date;
          $scope.time = CleanerService.formatTime(date);
          $scope.bookInfo.date_time = date.getTime();
          sessionStorage.user = angular.toJson($scope.bookInfo);
        };
        
        // this function call when load booking and reschedule booking page
        $scope.getBookInfo = function(){
          $scope.reschedule = BookingService.getRescheduleBooking();
          $scope.bookInfo = JSON.parse(sessionStorage.user);
          $scope.reserve_hours = $scope.bookInfo.reserve_hours;
          $scope.subtotal = $scope.bookInfo.charges * $scope.bookInfo.reserve_hours;
          if(!$scope.reschedule){
            AuthenticationService.getUsersByRole('cleaner').$loaded().then(function(data){
              $scope.cleaners = data;
              angular.forEach($scope.cleaners, function(value){
                if($scope.bookInfo.cleanerID == value.$id){
                  $scope.cleaner = value;
                  $scope.getSelectedCleanerInfo(value);
                 }
                });
            });
            $scope.date = new Date($scope.bookInfo.date_time);
            $scope.time = CleanerService.formatTime($scope.date);
          }
          get_states();
        };
        
        // this function call when select cleaner name on reschedule booking page
        $scope.getSelectedCleanerInfo = function(cleaner){
          sessionStorage.user = null;
          $scope.bookInfo.cleanerID = cleaner.$id;
          $scope.bookInfo.cleaner_firstname = cleaner.firstname;
          $scope.bookInfo.cleaner_lastname = cleaner.lastname;
          sessionStorage.user = angular.toJson($scope.bookInfo);
          var clanerAvailabilities = AvailabilitiesService.getCleanerAvailabilities(cleaner.$id);
          clanerAvailabilities.$loaded().then(function (availabilities) {
            $scope.Availabilities =  availabilities[0];
          });
          $scope.getCharges(cleaner.$id);
        };   
                
        // this function call cleaner hand
        $scope.setUserStatus = function(status){
          $scope.setStatus =status;
        };
        
        // this function call cleaner hand
        $scope.setBookingStatus = function(bookingID, status){
          if($scope.setStatus == 0 ){
            $scope.bookingObj.status = status;
            BookingService.updateBookingStatus(bookingID,$scope.bookingObj).then(function(data){ 
              toaster.pop('success', "Booking Approved Successfully");
            });
          }else 
             if($scope.setStatus == 1 ){
               $scope.bookingObj.status = status;
               BookingService.updateBookingStatus(bookingID,$scope.bookingObj).then(function(data){ 
                 toaster.pop('success', "Booking Rejected Successfully");
               });
             }
        }; 
          
        // this function call cleaner hand
        $scope.acceptOpenBooking = function(bookingID, status){
          $scope.bookingObj.status = status;
          $scope.bookingObj.cleanerID =  $scope.currentUser.$id;
          BookingService.updateBookingStatus(bookingID,$scope.bookingObj).then(function(data){ 
            toaster.pop('success', "Open Booking Accepted Successfully");
          });
        };
          
        $scope.submit = function(payment){
          $scope.payment = payment;
          $scope.booking = CustomerService.getData();
          console.log(payment,$scope.booking)
           var clanerProfile = AuthenticationService.getCurrentUser($scope.booking.cleanerID);
           clanerProfile.$loaded().then(function (clanerProfile) { 
           $scope.recID = clanerProfile.recipientID;      
				 });    
          Stripe.setPublishableKey('pk_test_VkqhfDUwIQNyWJK4sR7CKVsY');							  
          var token = Stripe.card.createToken({number: payment.number, cvc:payment.cvc, exp_month: payment.exp_month, exp_year: payment.exp_year}, stripeResponseHandler);
        }                 
        $scope.doPayment = function(token){
          var paymentinfo = {}; 
          console.log($scope.payment,$scope.booking,$scope.recID)
          $scope.payment.receipentID = $scope.recID;        
          $scope.payment.token     = token;
          $scope.payment.amount    = $scope.booking.total;
          console.log($scope.payment);		
          $http.post('/dopayment', $scope.payment)
          .success(function(res){									
            if(res){							
             BookingService.savePaymentInfo($scope.booking.$id,$scope.payment).then(function(data){ 
               $location.path('/customer_rating').replace();
                $(".btn-close-popup").click();
                toaster.pop('success', "Payment Successfully");
              });
            }
            else{
              alert('There is something went wrong !! ');
              }
          })
          .error(function(err){
            console.log(err);
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
        
        // this function call when click submit order on booking and reschedule booking page
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
            $scope.bookInfo.phone =$scope.currentUser.phone;
          }else{
            $scope.bookInfo.address1   =$scope.address1;
            $scope.bookInfo.address2   =$scope.address2;
            $scope.bookInfo.city       =$scope.city;
            $scope.bookInfo.state      =$scope.state;
            $scope.bookInfo.zip_code   =$scope.zip_code;
            $scope.bookInfo.phone      =$scope.phone;
          }
          if($scope.reschedule){  
            BookingService.cleanerBooking($scope.bookInfo).then(function (data) {                        
              sessionStorage.user = null;
              $location.path('/customer_booking/submit_orders').replace();
              toaster.pop('success', "Successfully generate Booking Order");
            });
          }else{
             BookingService.rescheduleBooking($routeParams.bookingID,$scope.bookInfo).then(function (data) {                        
               sessionStorage.user = null;
               $location.path('/customer_booking/submit_orders').replace();
               toaster.pop('success', "Successfully Reschedule Booking Order");
             });
           }
        };
        
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
         $scope.doPayment(token);
     }
   }
});

