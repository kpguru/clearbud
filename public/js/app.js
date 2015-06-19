var app = angular.module('clearbud',[
     'ngRoute',
    'ngAnimate',
    'ngResource',
    'ui.bootstrap',
    'ui.bootstrap.datetimepicker',
    'firebase',
    'toaster'
	]).constant('FIREBASE_URL', 'https://amber-inferno-3378.firebaseio.com/')
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        //$locationProvider.html5Mode(true);
        $routeProvider.otherwise({
            templateUrl: 'templates/home.html',
            controller: 'CustomerController'
        });
        $routeProvider.when('/home', {
            templateUrl: 'templates/home.html',
            controller: 'CustomerController'
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
           controller: 'CustomerController',
           resolve: {
                currentAuth: function (AuthenticationService) {
                    return AuthenticationService.requireAuth();
                }
            }
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
       $routeProvider.when('/cleaner_profiles/:cleanerID/home-smile-cleaners', {
           templateUrl: 'templates/Customer/cleaner-my-profile.html',
           controller: 'CleanerController',
           resolve: {
                currentAuth: function (AuthenticationService) {
                    return AuthenticationService.requireAuth();
                }
            }
       });
          $routeProvider.when('/cleaner_profiles/:cleanerID', {
           templateUrl: 'templates/Cleaner/cleaner-my-profile1.html',
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
           templateUrl: 'templates/Cleaner/customer-dashboard.html',
           controller: 'BookingController',
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
    }]);