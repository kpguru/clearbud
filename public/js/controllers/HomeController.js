'use strict';
  app.controller('HomeController', function ($scope, $rootScope, $http, $location, toaster, AuthenticationService, CustomerService, SearchService, CleanerService) {
    $scope.cleanerData = [];
    $scope.cleaners = [];
    $scope.searchManage = 0;
    $rootScope.showLoading=false;
    $scope.availabilities = CustomerService.availabilities();     
	  $scope.demo1={
										min: 0,
										max: 1000
									 };		
		//find price range		 
		$scope.priceRange = function(){		
				$rootScope.showLoading=true;				
			$scope.cleanerData=[];
			$scope.cd = CustomerService.getData();
			angular.forEach($scope.cd, function(value){
				 if(value.cleaner_charge >= $scope.demo1.min && value.cleaner_charge <= $scope.demo1.max){						   						 
					 $scope.cleanerData.push(value); 
					 }
				})	
				$rootScope.showLoading=false;		  			
		}
    //get all cleaner deatails for search page at page loading time
    $scope.getCleanersProfile = function(){
			$rootScope.showLoading=true;
      AuthenticationService.getUsersByRole('cleaner').$loaded().then(function(data){
        SearchService.getCleanersProfile(true,data,null,function(response){
					$rootScope.showLoading=false;
          $scope.searchManage=0;
          $scope.cleanerData = response;
        });
      });
    }
    
    //sort by price and score
    $scope.setCleanerSearch = function(sort){
			$rootScope.showLoading=true;
      $scope.cleanerData = [];
      $scope.searchManage= 1;
      $scope.cleanerData = CustomerService.getData();
      if(sort == 'price'){
				$rootScope.showLoading=false;
        $scope.sortType     = 'cleaner_charge'; // set the default sort type
        $scope.sortOrder  = false;  // set the default sort order  
      }else{
				$rootScope.showLoading=false;
        $scope.sortType     = 'score'; // set the default sort type
        $scope.sortOrder  = true;  // set the default sort order  
        }
    };
    
    //search cleaner by zip code, availability, name
    $scope.searchCleaner = function(searchCredentials){
			$rootScope.showLoading=true;
      if(angular.isUndefined(searchCredentials) || angular.isUndefined(searchCredentials.zipcode) ||searchCredentials.zipcode==''){
				$scope.getCleanersProfile();
        toaster.pop('error', "Please Enter Zip Code!");
        $rootScope.showLoading=false;
        return;
      }
      CleanerService.getCleanerByZipCode(searchCredentials.zipcode).$loaded().then(function(data){
        $scope.cleaners = [];
        angular.forEach(data, function(value){
          if(value.role == 'cleaner')
          {
            $scope.cleaners.push(value);
          }
        });
        SearchService.getCleanersProfile(false,$scope.cleaners,searchCredentials,function(response){
          $rootScope.showLoading=false;
          $scope.cleanerData = [];
          $scope.searchManage=0;
          $scope.cleanerData = response;
        });
      });
    };
    
    //send mail when customer click on contact us button
    $scope.sendEmail = function(contact_us){
			$rootScope.showLoading=true;
      $http.post('/contact-us',contact_us).
		    success(function(data, status, headers, config) {
					$rootScope.showLoading=false;
			    toaster.pop('success', "Send mail Successfully!");
          $location.path('/home');
		    }).
		    error(function(data, status, headers, config) {
		    	toaster.pop('error', "Error in send mail!");
		    }); 
    };
  });
