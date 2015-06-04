var app = angular.module('clearbud',[
     'ngRoute',
    'ngAnimate',
    'ngResource',
    'ui.bootstrap',
    'firebase',
    'toaster'
	]).constant('FIREBASE_URL', 'https://amber-inferno-3378.firebaseio.com/')
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        //$locationProvider.html5Mode(true);
        $routeProvider.otherwise({
            templateUrl: 'templates/home.html',
            controller: 'HomeController'
        });
        $routeProvider.when('/home', {
            templateUrl: 'templates/home.html',
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
        $routeProvider.when('/customer-profile', {
            templateUrl: 'templates/Customer/customer-profile.html',
            controller: 'CustomerController'
        });
        $routeProvider.when('/cleaner-profile', {
            templateUrl: 'templates/Cleaner/cleaner-profile.html',
            controller: 'CleanerController'
        });
          $routeProvider.when('/login', {
            templateUrl: 'templates/login.html',
            controller: 'AuthController'
        });
    }]);