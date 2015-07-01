'use strict';

	app.controller('SearchController', function ($scope, $http, $window, $location, AvailabilitiesService, SearchService, ChargesService, RatingService, BookingService, AuthenticationService, CustomerService, CleanerService,$firebase, toaster, FIREBASE_URL) { 
        $scope.signedIn = AuthenticationService.signedIn;
         $scope.cleanerData = [];
         $scope.searchTypes = [
														{name: 'ZipCode', value: 'zipCode', groupBy: 'ZIP CODE'},
														{name: 'Name', value: 'name', groupBy: 'NAME'},
														{name: 'Frequency', value: 'frequency', groupBy: 'FREQUENCY'}
														];
														
					$scope.ESForm = {
                searchTerm: '',
                searchType: $scope.searchTypes[0].value,
                searchWords: false
               };	
               
                $scope.ES = function (data) {
                $scope.loading = true;
                $scope.searchData = [];
                $scope.searchTotal = 0;
                var index = 'firebase';
                var term = data.searchTerm ? data.searchTerm : '';
                var name = data.searchType ? typeof(data.searchType) == 'object' ? data.searchType.value : data.searchType : $scope.searchTypes[0].value;
                var words = data.searchWords ? data.searchWords : false;

                SearchService.searchFromDB(index, term, name, words).then(function (data) {
                    $scope.noResult = true;
                    console.log(data);
                    //~ if (data.total > 0) {
                        //~ var searchResult = data.hits;
                        //~ ElasticSearchService.getSearchingAllDataFromDB(searchResult, name).then(function(data){
                            //~ $scope.searchData = data;
                            //~ $scope.searchTotal = data.length;
                        //~ })
                    //~ } else {
                        //~ $scope.searchData = '';
                        //~ $scope.searchTotal = '';
                        //~ $scope.noResult = false;
                    //~ }
                    //~ $scope.loading = false;
                })
            };							
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
											 if(charges[0]){                 
												 var clanerAvailabilities = AvailabilitiesService.getCleanerAvailabilities(cleaner.$id);
												 clanerAvailabilities.$loaded().then(function (availabilities) { 
													 var clanerRating = RatingService.getCleanerRatings(cleaner.$id);
													 clanerRating.$loaded().then(function (data) {
														 if(data.length > 0){
															 var c = 0;
															 var r = 0;
															 $scope.average_rating = 0;
															 var sum = 0;
															 while(r<data.length){
																 angular.forEach(data[c].rating, function(value){
																	 if(value.average_rating){
																		 sum = sum + parseInt(value.average_rating); 
																		 c++;
																	 }
																 });
																 $scope.average_rating = Math.round(sum / c); 
																 r++;
															 }
														 }
														 if(Number.isNaN($scope.average_rating))
														 {
															$scope.average_rating = 0;
														 }
														 $scope.cleanerData.push({firstname:cleaner.firstname,lastname:cleaner.lastname,cleaner_id:cleaner.$id,isApproved:cleaner.isApproved,cleaner_logo:cleaner.cleaner_logo,cleaner_charge:charges[0].one_time,cleaner_availabilities:availabilities,cleaner_rating:$scope.average_rating});                
														 CustomerService.setData($scope.cleanerData);
													 });
												 });
											 }
										 });
									 });
								 });
						}; 

   });
