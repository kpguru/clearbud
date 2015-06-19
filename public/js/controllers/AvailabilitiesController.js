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
                    if(!angular.isUndefined($scope.allDayAllTime))
                    {
                        $scope.availabilities.all_day_all_time = $scope.allDayAllTime;
                    }
                    if(!angular.isUndefined($scope.sunday))
                    {

                        $scope.availabilities.sunday.day =$scope.sunday.day;
                        $scope.availabilities.sunday.fromTime = CleanerService.formatTime($scope.sunday.fromTime);
                        $scope.availabilities.sunday.toTime =CleanerService.formatTime($scope.sunday.toTime);
                    }
                    if(!angular.isUndefined($scope.monday))
                    {
                        $scope.availabilities.monday.day =$scope.monday.day;
                        $scope.availabilities.monday.fromTime =CleanerService.formatTime($scope.monday.fromTime);
                        $scope.availabilities.monday.toTime =CleanerService.formatTime($scope.monday.toTime);
                    }
                    if(!angular.isUndefined($scope.tuesday))
                    {
                        $scope.availabilities.tuesday.day =$scope.tuesday.day;
                        $scope.availabilities.tuesday.fromTime =CleanerService.formatTime($scope.tuesday.fromTime);
                        $scope.availabilities.tuesday.toTime =CleanerService.formatTime($scope.tuesday.toTime);
                    }
                    if(!angular.isUndefined($scope.wednesday))
                    {
                        $scope.availabilities.wednesday.day =$scope.wednesday.day;
                        $scope.availabilities.wednesday.fromTime =CleanerService.formatTime($scope.wednesday.fromTime);
                        $scope.availabilities.wednesday.toTime =CleanerService.formatTime($scope.wednesday.toTime);
                    }
                    if(!angular.isUndefined($scope.thusday))
                    {
                        $scope.availabilities.thusday.day =$scope.thusday.day;
                        $scope.availabilities.thusday.fromTime =CleanerService.formatTime($scope.thusday.fromTime);
                        $scope.availabilities.thusday.toTime =CleanerService.formatTime($scope.thusday.toTime);
                    }
                    if(!angular.isUndefined($scope.friday))
                    {
                        $scope.availabilities.friday.day =$scope.friday.day;
                        $scope.availabilities.friday.fromTime =CleanerService.formatTime($scope.friday.fromTime);
                        $scope.availabilities.friday.toTime =CleanerService.formatTime($scope.friday.toTime);
                    }
                    if(!angular.isUndefined($scope.saturday))
                    {
                        $scope.availabilities.saturday.day =$scope.saturday.day;
                        $scope.availabilities.saturday.fromTime =CleanerService.formatTime($scope.saturday.fromTime);
                        $scope.availabilities.saturday.toTime =CleanerService.formatTime($scope.saturday.toTime);
                    }
                    if(!angular.isUndefined($scope.everyday))
                    {
                        $scope.availabilities.everyday.day =$scope.everyday.day;
                        $scope.availabilities.everyday.fromTime =CleanerService.formatTime($scope.everyday.fromTime);
                        $scope.availabilities.everyday.toTime =CleanerService.formatTime($scope.everyday.toTime);
                    }
                    if(!angular.isUndefined($scope.weekends))
                    {
                        $scope.availabilities.weekends.day =$scope.weekends.day;
                        $scope.availabilities.weekends.fromTime =CleanerService.formatTime($scope.weekends.fromTime);
                        $scope.availabilities.weekends.toTime =CleanerService.formatTime($scope.weekends.toTime);
                    }
                    if(!angular.isUndefined($scope.montofri))
                    {
                        $scope.availabilities.monday_to_friday.day =$scope.montofri.day;
                        $scope.availabilities.monday_to_friday.fromTime =CleanerService.formatTime($scope.montofri.fromTime);
                        $scope.availabilities.monday_to_friday.toTime =CleanerService.formatTime($scope.montofri.toTime);

                    }

                    AvailabilitiesService.addCleanerAvailabilities( $scope.availabilities).then(function(data) {
                        toaster.pop('success', "Add Cleaner availabilities successfully!");
                    },function (data) {
                        toaster.pop('error', "Error..!", error.toString());
                    });
                 }
            }
        });
    });
    