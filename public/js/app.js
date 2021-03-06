var app = angular.module('clearbud',[
     'ngRoute',
    'ngAnimate',
    'ngResource',
    'ui.bootstrap',
    'firebase',
    'toaster',
    'ngMap',
    'angularPayments',
    'ui.bootstrap.datetimepicker',
    'ui-rangeSlider',
    'angularUtils.directives.dirPagination'
	]).constant('FIREBASE_URL', 'https://amber-inferno-3378.firebaseio.com/')	
	  .constant('SECRET_KEY' , 'sk_test_IeK9KWcycB3NKQkWunnNkWlN')
		.constant('PUBLISH_KEY' , 'key pk_test_VkqhfDUwIQNyWJK4sR7CKVsY')			 

    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
			  Stripe.setPublishableKey('key pk_test_VkqhfDUwIQNyWJK4sR7CKVsY');
        $routeProvider.otherwise({
            templateUrl: 'templates/home.html',
            controller: 'HomeController'
        });
        $routeProvider.when('/home', {
            templateUrl: 'templates/home.html',
            controller: 'HomeController'
        });
        $routeProvider.when('/contact-us', {
            templateUrl: 'templates/contact-us.html',
            controller: 'HomeController'
        });         
         $routeProvider.when('/customer-signup', {
            templateUrl: 'templates/customer-signup.html',
            controller: 'AuthController'
        });
          $routeProvider.when('/cleaner-signup', {
            templateUrl: 'templates/cleaner-signup.html',
            controller: 'AuthController'
        });
          $routeProvider.when('/login', {
            templateUrl: 'templates/login.html',
            controller: 'AuthController'
        });
          $routeProvider.when('/forgot-password', {
            templateUrl: 'templates/forgot-password.html',
            controller: 'AuthController'
        });
        $routeProvider.when('/change-password', {
            templateUrl: 'templates/change-password.html',
            controller: 'AuthController',
            resolve: {
                currentAuth: function (AuthenticationService) {
                    return AuthenticationService.requireAuth();
                }
            }
        }); 
        $routeProvider.when('/cleaner-dashboard', {
            templateUrl: 'templates/Cleaner/cleaner-dashboard.html',
            controller: 'CleanerController',
            resolve: {
                currentAuth: function (AuthenticationService) {
                    return AuthenticationService.requireAuth();
                }
            }
        });         
        $routeProvider.when('/cleaner-edit/:userKey', {
            templateUrl: 'templates/Cleaner/cleaner-edit.html',
            controller: 'CleanerController',
            resolve: {
                currentAuth: function (AuthenticationService) {
                    return AuthenticationService.requireAuth();
                }
            }
        });
         $routeProvider.when('/cleaner/:userKey/profile', {
            templateUrl: 'templates/Cleaner/cleaner-profile.html',
            controller: 'CleanerController',
            resolve: {
                currentAuth: function (AuthenticationService) {
                    return AuthenticationService.requireAuth();
                }
            }
        });
        $routeProvider.when('/customer-dashboard', {
           templateUrl: 'templates/Customer/customer-dashboard.html',
           controller: 'CustomerController',
           resolve: {
                currentAuth: function (AuthenticationService) {
                    return AuthenticationService.requireAuth();
                }
            }
       });
       $routeProvider.when('/customer-edit/:userKey', {
           templateUrl: 'templates/Customer/customer-edit.html',
           controller: 'CustomerController',
           resolve: {
                currentAuth: function (AuthenticationService) {
                    return AuthenticationService.requireAuth();
                }
            }
       });
        $routeProvider.when('/search-cleaner', {
           templateUrl: 'templates/Customer/customer-search.html',
           controller: 'HomeController',
       });
       $routeProvider.when('/admin-dashboard', {
           templateUrl: 'templates/Admin/admin-dashboard.html',
           controller: 'AdminController',
           resolve: {
                currentAuth: function (AuthenticationService) {
                    return AuthenticationService.requireAuth();
                }
            }
       }); 
       $routeProvider.when('/cleaner-availabilities', {
           templateUrl: 'templates/Cleaner/cleaner-availabilities.html',
           controller: 'AvailabilitiesController',
           resolve: {
                currentAuth: function (AuthenticationService) {
                    return AuthenticationService.requireAuth();
                }
            }
       });
       $routeProvider.when('/cleaner_profiles/:cleanerID', {
           templateUrl: 'templates/Customer/customer-view-cleaner.html',
           controller: 'CleanerController'
       });
          $routeProvider.when('/cleaner/:cleanerID/profiles', {
           templateUrl: 'templates/Cleaner/cleaner-my-profile.html',
           controller: 'CleanerController',
           resolve: {
                currentAuth: function (AuthenticationService) {
                    return AuthenticationService.requireAuth();
                }
            }
       });
       $routeProvider.when('/cleaner_profiles/home-smile-cleaners/orders/new', {
           templateUrl: 'templates/Cleaner/cleaner-book.html',
           controller: 'BookingController',
           resolve: {
                currentAuth: function (AuthenticationService) {
                    return AuthenticationService.requireAuth();
                }
            }
       });       
       $routeProvider.when('/customer_booking/submit_orders', {
           templateUrl: 'templates/Customer/customer-dashboard.html',
           controller: 'CustomerController',
           resolve: {
                currentAuth: function (AuthenticationService) {
                    return AuthenticationService.requireAuth();
                }
            }
       });
       $routeProvider.when('/customer_rating', {
           templateUrl: 'templates/Customer/customer_rating.html',
           controller: 'CustomerController',
           resolve: {
                currentAuth: function (AuthenticationService) {
                    return AuthenticationService.requireAuth();
                }
            }
       });
       $routeProvider.when('/customer_booking/view_orders', {
           templateUrl: 'templates/Customer/show-booking.html',
           controller: 'CustomerController',
           resolve: {
                currentAuth: function (AuthenticationService) {
                    return AuthenticationService.requireAuth();
                }
            }
       });
       $routeProvider.when('/bookings', {
           templateUrl: 'templates/Booking/booking-view.html',
           controller: 'BookingController',
           resolve: {
                currentAuth: function (AuthenticationService) {
                    return AuthenticationService.requireAuth();
                }
            }
       });
       $routeProvider.when('/open-bookings', {
           templateUrl: 'templates/Booking/booking-open.html',
           controller: 'BookingController',
           resolve: {
                currentAuth: function (AuthenticationService) {
                    return AuthenticationService.requireAuth();
                }
            }
       });
       $routeProvider.when('/:bookingID/reschedule-booking', {
           templateUrl: 'templates/Booking/reschedule-booking.html',
           controller: 'BookingController',
           resolve: {
                currentAuth: function (AuthenticationService) {
                    return AuthenticationService.requireAuth();
                }
            }
       });
       $routeProvider.when('/payment-history/:cleanerID', {
           templateUrl: 'templates/Cleaner/payment-history.html',
           controller: 'BookingController',
           resolve: {
                currentAuth: function (AuthenticationService) {
                    return AuthenticationService.requireAuth();
                }
            }
       });
    }])
     .run(["$rootScope", "$location", function ($rootScope, $location) {
        var history = [];
        $rootScope.$on( "$routeChangeStart", function(event, next, current) {
          if(current != undefined){
            if(current.originalPath != undefined){
              history.push(current.originalPath);
            }
          }
        });

        $rootScope.$on("$routeChangeError", function (event, next, previous, error) {
            // We can catch the error thrown when the $requireAuth promise is rejected
            // and redirect the user back to the home page
            if (error === "AUTH_REQUIRED") {
                $location.path("/login");
            }
        });

        //GO back code
        $rootScope.back = function () {
            var prevUrl = history.length > 1 ? history.splice(-2)[0] : "/";
            $location.path(prevUrl);
        };
        //end Go back code
       }]);
