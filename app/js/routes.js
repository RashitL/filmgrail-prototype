//app.config(['$routeProvider', '$locationProvider',
//  function ($routeProvider, $locationProvider) {
//      if (window.history && window.history.pushState) {
//          $locationProvider.html5Mode(true).hashPrefix('!');
//      }
//  }]);

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('feed', {
            url: "/",
            templateUrl: 'app/partials/feed.cshtml',
            controller: 'feedCtrl'
        });

    $urlRouterProvider
         // If the url is ever invalid, e.g. '/asdf', then redirect to '/' aka the home state
         .otherwise('/');
}]);