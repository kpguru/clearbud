'use strict';

	app.controller('AvailabilitiesController', function ($scope, $window, $location, AvailabilitiesService, CleanerService, ChargesService, AuthenticationService, $firebase, toaster, FIREBASE_URL) { 
        $scope.signedIn = AuthenticationService.signedIn; 
        $scope.availabilities = {};
        $scope.availabilities.sunday = {}; 
        $scope.availabilities.monday = {};
        $scope.availabilities.tuesday = {};
        $scope.availabilities.wednesday = {};
        $scope.availabilities.thusday = {}; 
        $scope.availabilities.friday = {};
        $scope.availabilities.saturday = {};
        $scope.availabilities.everyday = {};
        $scope.availabilities.weekends = {}; 
        $scope.availabilities.monday_to_friday = {};  

        var ref = new Firebase(FIREBASE_URL);
        ref.onAuth(function(authUser) {
            if (authUser != null) { 
               $scope.saveCleanerAvailabilities = function(){
                $scope.availabilities.cleaner_id = authUser.uid;
                if(!angular.isUndefined($scope.allDayAllTime)){
                    $scope.availabilities.all_day_all_time = $scope.allDayAllTime;
                }
                if(!angular.isUndefined($scope.sunday.day) && $scope.sunday.day == "Sunday"){
                    $scope.availabilities.sunday.day =$scope.sunday.day;
                    $scope.availabilities.sunday.fromTime = $scope.sunday.fromTime.getTime();
                    $scope.availabilities.sunday.toTime   = $scope.sunday.toTime.getTime();
                }
                if(!angular.isUndefined($scope.monday.day) && $scope.monday.day == "Monday"){
                    $scope.availabilities.monday.day =$scope.monday.day;
                    $scope.availabilities.monday.fromTime =$scope.monday.fromTime.getTime();
                    $scope.availabilities.monday.toTime =$scope.monday.toTime.getTime();
                }
                if(!angular.isUndefined($scope.tuesday.day) && $scope.tuesday.day == "Tuesday"){
                    $scope.availabilities.tuesday.day =$scope.tuesday.day;
                    $scope.availabilities.tuesday.fromTime =$scope.tuesday.fromTime.getTime();
                    $scope.availabilities.tuesday.toTime =$scope.tuesday.toTime.getTime();
                }
                if(!angular.isUndefined($scope.wednesday.day) && $scope.wednesday.day == "Wednesday"){
                    $scope.availabilities.wednesday.day =$scope.wednesday.day;
                    $scope.availabilities.wednesday.fromTime =$scope.wednesday.fromTime.getTime();
                    $scope.availabilities.wednesday.toTime =$scope.wednesday.toTime.getTime();
                }
                if(!angular.isUndefined($scope.thusday.day) && $scope.thusday.day == "Thusday"){
                    $scope.availabilities.thusday.day =$scope.thusday.day;
                    $scope.availabilities.thusday.fromTime =$scope.thusday.fromTime.getTime();
                    $scope.availabilities.thusday.toTime =$scope.thusday.toTime.getTime();
                }
                if(!angular.isUndefined($scope.friday.day) && $scope.friday.day == "Friday"){
                    $scope.availabilities.friday.day =$scope.friday.day;
                    $scope.availabilities.friday.fromTime =$scope.friday.fromTime.getTime();
                    $scope.availabilities.friday.toTime =$scope.friday.toTime.getTime();
                }
                if(!angular.isUndefined($scope.saturday.day) && $scope.saturday.day == "Saturday"){
                    $scope.availabilities.saturday.day =$scope.saturday.day;
                    $scope.availabilities.saturday.fromTime =$scope.saturday.fromTime.getTime();
                    $scope.availabilities.saturday.toTime =$scope.saturday.toTime.getTime();
                }
                if(!angular.isUndefined($scope.everyday.day) && $scope.everyday.day == "Everyday"){
                    $scope.availabilities.everyday.day =$scope.everyday.day;
                    $scope.availabilities.everyday.fromTime =$scope.everyday.fromTime.getTime();
                    $scope.availabilities.everyday.toTime =$scope.everyday.toTime.getTime();
                }
                if(!angular.isUndefined($scope.weekends.day) && $scope.weekends.day == "Weekends"){
                    $scope.availabilities.weekends.day =$scope.weekends.day;
                    $scope.availabilities.weekends.fromTime =$scope.weekends.fromTime.getTime();
                    $scope.availabilities.weekends.toTime =$scope.weekends.toTime.getTime();
                }
                if(!angular.isUndefined($scope.montofri.day) && $scope.montofri.day == "Monday-Friday"){
                    $scope.availabilities.monday_to_friday.day =$scope.montofri.day;
                    $scope.availabilities.monday_to_friday.fromTime =$scope.montofri.fromTime.getTime();
                    $scope.availabilities.monday_to_friday.toTime =$scope.montofri.toTime.getTime();
                }
                AvailabilitiesService.addCleanerAvailabilities($scope.availabilities).then(function(data) {
                    toaster.pop('success', "Add Cleaner availabilities successfully!");
                },function (data) {
                    toaster.pop('error', "Error..!", error.toString());
                });
             }
               }
               $scope.updateCleanerAvailabilities = function(){
                $scope.availabilities.cleaner_id = authUser.uid;
                if(!angular.isUndefined($scope.allDayAllTime)){
                    $scope.availabilities.all_day_all_time = $scope.allDayAllTime;
                }
                if(!angular.isUndefined($scope.sunday) && $scope.sunday.day == "Sunday"){
                    $scope.availabilities.sunday.day =$scope.sunday.day;
                    if(angular.isDate($scope.sunday.fromTime)){
                        $scope.availabilities.sunday.fromTime =  $scope.sunday.fromTime.getTime();
                        $scope.availabilities.sunday.toTime =$scope.sunday.toTime.getTime();
                 }else{
                    $scope.availabilities.sunday.fromTime = $scope.sunday.fromTime;
                     $scope.availabilities.sunday.toTime =$scope.sunday.toTime;
                 }
                }
                if(!angular.isUndefined($scope.monday) && $scope.monday.day == "Monday"){
                    $scope.availabilities.monday.day =$scope.monday.day;
                    if(angular.isDate($scope.monday.fromTime)){
                      $scope.availabilities.monday.fromTime =$scope.monday.fromTime.getTime();
                      $scope.availabilities.monday.toTime =$scope.monday.toTime.getTime();
                    }else{
                      $scope.availabilities.monday.fromTime =$scope.monday.fromTime;
                      $scope.availabilities.monday.toTime =$scope.monday.toTime;
                    }
                }
                if(!angular.isUndefined($scope.tuesday) && $scope.tuesday.day == "Tuesday"){
                    $scope.availabilities.tuesday.day =$scope.tuesday.day;
                    if(angular.isDate($scope.tuesday.fromTime)){
                        $scope.availabilities.tuesday.fromTime =$scope.tuesday.fromTime.getTime();
                        $scope.availabilities.tuesday.toTime =$scope.tuesday.toTime.getTime();
                    }else{
                         $scope.availabilities.tuesday.fromTime =$scope.tuesday.fromTime;
                        $scope.availabilities.tuesday.toTime =$scope.tuesday.toTime;
                    }
                }
                if(!angular.isUndefined($scope.wednesday) && $scope.wednesday.day == "Wednesday"){
                    $scope.availabilities.wednesday.day =$scope.wednesday.day;
                    if(angular.isDate($scope.wednesday.fromTime)){
                      $scope.availabilities.wednesday.fromTime =$scope.wednesday.fromTime.getTime();
                      $scope.availabilities.wednesday.toTime =$scope.wednesday.toTime.getTime();
                     }else{
                      $scope.availabilities.wednesday.fromTime =$scope.wednesday.fromTime;
                      $scope.availabilities.wednesday.toTime =$scope.wednesday.toTime;
                     }
                }
                if(!angular.isUndefined($scope.thusday) && $scope.thusday.day == "Thusday"){
                    $scope.availabilities.thusday.day =$scope.thusday.day;
                    if(angular.isDate($scope.thusday.fromTime)){
                        $scope.availabilities.thusday.fromTime =$scope.thusday.fromTime.getTime();
                        $scope.availabilities.thusday.toTime =$scope.thusday.toTime.getTime();
                    }else{                        
                        $scope.availabilities.thusday.fromTime =$scope.thusday.fromTime;
                        $scope.availabilities.thusday.toTime =$scope.thusday.toTime;
                    }
                }
                if(!angular.isUndefined($scope.friday) && $scope.friday.day == "Friday"){
                    $scope.availabilities.friday.day =$scope.friday.day;
                    if(angular.isDate($scope.friday.fromTime)){
                        $scope.availabilities.friday.fromTime =$scope.friday.fromTime.getTime();
                        $scope.availabilities.friday.toTime =$scope.friday.toTime.getTime();
                    }else{
                        $scope.availabilities.friday.fromTime =$scope.friday.fromTime;
                        $scope.availabilities.friday.toTime =$scope.friday.toTime;
                    }
                }
                if(!angular.isUndefined($scope.saturday) && $scope.saturday.day == "Saturday"){
                    $scope.availabilities.saturday.day =$scope.saturday.day;
                    if(angular.isDate($scope.saturday.fromTime)){
                        $scope.availabilities.saturday.fromTime =$scope.saturday.fromTime.getTime();
                        $scope.availabilities.saturday.toTime =$scope.saturday.toTime.getTime();
                    }else{
                        $scope.availabilities.saturday.fromTime =$scope.saturday.fromTime;
                        $scope.availabilities.saturday.toTime =$scope.saturday.toTime;
                    }
                }
                if(!angular.isUndefined($scope.everyday) && $scope.everyday.day == "Everyday"){
                    $scope.availabilities.everyday.day =$scope.everyday.day;
                    if(angular.isDate($scope.everyday.fromTime)){
                        $scope.availabilities.everyday.fromTime =$scope.everyday.fromTime.getTime();
                        $scope.availabilities.everyday.toTime =$scope.everyday.toTime.getTime();
                    }else{
                         $scope.availabilities.everyday.fromTime =$scope.everyday.fromTime;
                         $scope.availabilities.everyday.toTime =$scope.everyday.toTime;
                    }
                }
                if(!angular.isUndefined($scope.weekends) && $scope.weekends.day == "Weekends"){
                    $scope.availabilities.weekends.day =$scope.weekends.day;
                    if(angular.isDate($scope.weekends.fromTime)){
                        $scope.availabilities.weekends.fromTime =$scope.weekends.fromTime.getTime();
                        $scope.availabilities.weekends.toTime =$scope.weekends.toTime.getTime();
                    }else{
                        $scope.availabilities.weekends.fromTime =$scope.weekends.fromTime;
                        $scope.availabilities.weekends.toTime =$scope.weekends.toTime;
                    }
                }
                if(!angular.isUndefined($scope.montofri) && $scope.montofri.day == "Monday-Friday"){
                    $scope.availabilities.monday_to_friday.day =$scope.montofri.day;
                    if(angular.isDate($scope.wednesday.fromTime)){
                    $scope.availabilities.monday_to_friday.fromTime =$scope.montofri.fromTime.getTime();
                    $scope.availabilities.monday_to_friday.toTime =$scope.montofri.toTime.getTime();
                }else{
                    $scope.availabilities.monday_to_friday.fromTime =$scope.montofri.fromTime;
                    $scope.availabilities.monday_to_friday.toTime =$scope.montofri.toTime;
                }
                }
                AvailabilitiesService.updateCleanerAvailabilities($scope.Availabilities.$id, $scope.availabilities).then(function(data) {
                    toaster.pop('success', "Update Cleaner availabilities successfully!");
                },function (data) {
                    toaster.pop('error', "Error..!", error.toString());
                })
               }

        });
    });
    