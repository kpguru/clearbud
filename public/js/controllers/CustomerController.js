'use strict';

	app.controller('CustomerController', function ($scope, $http, $window, $location, AuthenticationService, CustomerService, CleanerService,$firebase, toaster, FIREBASE_URL) { 
        $scope.signedIn = AuthenticationService.signedIn;
        get_states();
        $scope.user = {};
        $scope.rating = 5;
        $scope.rateFunction = function(rating) {
          console.log('Rating selected - ' + rating);
        };
        $scope.steps = [
                        'Appointments',
                        'Account'
                       ];
        $scope.selection = $scope.steps[0];
        $scope.searchCleanerByName = function(name){
          CleanerService.getCleanerByName(name).$loaded().then(function(data){
            $scope.cleanerData = data;
          });
        }        
        var ref = new Firebase(FIREBASE_URL);
        ref.onAuth(function(authUser) {
            if(authUser != null) {
                var users = AuthenticationService.getCurrentUser(authUser.uid);
                users.$loaded().then(function (data) {
                    $scope.currentUser = data;
                });
                $scope.customer_edit = function(customer){
                    if(!customer.firstname  || !customer.lastname ||!customer.zip_code){
                       return; 
                    }  
                	$scope.user.firstname = customer.firstname;
                    $scope.user.lastname = customer.lastname;
                    $scope.user.phone = customer.phone;
                    $scope.user.address1 = customer.address1;
                    $scope.user.address2 = customer.address2;
                    $scope.user.city = customer.city;
                    $scope.user.state = customer.state;
                    $scope.user.zip_code = customer.zip_code;
                    $scope.user.customer_image = $scope.image ? $scope.image.resized.dataURL : $scope.currentUser.customer_image;
                    CustomerService.updateCustomer($scope.currentUser.$id,$scope.user).then(function() {
		                toaster.pop('success', "Update successfully!");
		                window.location = "#/customer-dashboard";
		            },function (error) {
		                toaster.pop('error', "Error..!", error.toString());
		            });
                };

                $scope.getCurrentStepIndex = function(){
                    // Get the index of the current step given selection
                    return _.indexOf($scope.steps, $scope.selection);
                };

                // Go to a defined step index
                $scope.goToStep = function(index) {
                    if ( !_.isUndefined($scope.steps[index]) )
                    {
                      $scope.selection = $scope.steps[index];
                    }
                }; 
            }              
        });

        function get_states() {
            return $http.get('js/data/states.json').then(function (res) {
                $scope.states = res.data;
            });
        }
    });