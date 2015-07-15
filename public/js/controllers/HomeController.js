'use strict';
  app.controller('HomeController', function ($scope, $http, $location, toaster, AuthenticationService, CustomerService, SearchService, CleanerService) {
    $scope.cleanerData = [];
    $scope.cleaners = [];
    $scope.searchManage = 0;
    $scope.availabilities = CustomerService.availabilities(); 
    
    //get all cleaner deatails for search page at page loading time
    $scope.getCleanersProfile = function(){
      AuthenticationService.getUsersByRole('cleaner').$loaded().then(function(data){
        SearchService.getCleanersProfile(true,data,null,function(response){
          $scope.searchManage=0;
          $scope.cleanerData = response;
        });
      });
    }
    
    //sort by price and score
    $scope.setCleanerSearch = function(sort){
      $scope.cleanerData = [];
      $scope.searchManage= 1;
      $scope.cleanerData = CustomerService.getData();
      if(sort == 'price'){
        $scope.sortType     = 'cleaner_charge'; // set the default sort type
        $scope.sortOrder  = false;  // set the default sort order  
      }else{
        $scope.sortType     = 'score'; // set the default sort type
        $scope.sortOrder  = true;  // set the default sort order  
        }
    };
    
    //search cleaner by zip code, availability, name
    $scope.searchCleaner = function(searchCredentials){
      $scope.name = searchCredentials.name;
      CleanerService.getCleanerByZipCode(searchCredentials.zipcode).$loaded().then(function(data){
        $scope.cleaners = [];
        angular.forEach(data, function(value){
          if(value.role == 'cleaner')
          {
            $scope.cleaners.push(value);
          }
        });
        if($scope.cleaners.length > 0)
        {
          SearchService.getCleanersProfile(false,$scope.cleaners,searchCredentials,function(response){
            $scope.cleanerData = [];
            $scope.searchManage=0;
            $scope.cleanerData = response;
          });
        }else{
          $scope.cleanerData = [];
          toaster.pop('error', "No Result found!");
          }
      });
    };
    
    //send mail when customer click on contact us button
    $scope.sendEmail = function(contact_us){
      $http.post('/contact-us',contact_us).
		    success(function(data, status, headers, config) {
			    toaster.pop('success', "Send mail Successfully!");
          $location.path('/home');
		    }).
		    error(function(data, status, headers, config) {
		    	toaster.pop('error', "Error in send mail!");
		    }); 
    };
  });
