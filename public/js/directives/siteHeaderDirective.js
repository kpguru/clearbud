app.directive('siteHeader', [ '$window', function ($window) {
    return {
        restrict: 'AE',
        templateUrl: 'template/back-forward-button/back-forward-button.html',
        scope: {
            title: '@title',
            icons: '@icons',
            class: '@buttonClass'
        },
        link: function(scope, element, attrs) {
            element.bind('click', function () {
                $window.history.back();
            });
        }
    };
}]);