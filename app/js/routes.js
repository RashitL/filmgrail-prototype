//app.config(['$routeProvider', '$locationProvider',
//  function ($routeProvider, $locationProvider) {
//      if (window.history && window.history.pushState) {
//          $locationProvider.html5Mode(true).hashPrefix('!');
//      }
//  }]);

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state("feed", {
            url: "/feed",
            templateUrl: "app/partials/feed.cshtml",
            controller: 'feedCtrl'
        }).state("feed2", {
            url: "/feed2",
            templateUrl: "app/partials/feed2.cshtml",
            controller: 'feedCtrl'
        }).state("movies", {
            url: "/movies",
            templateUrl: "app/partials/movies.cshtml",
            
        }).state("notification-news", {
            url: "/notification-news",
            templateUrl: "app/partials/notifications/notification-news.cshtml",
            controller: 'feedCtrl'

        }).state("notification-you", {
            url: "/notification-you",
            templateUrl: "app/partials/notifications/notification-you.cshtml",
            controller: 'feedCtrl'

        }).state("notification-inbox", {
            url: "/notification-inbox",
            templateUrl: "app/partials/notifications/notification-inbox.cshtml",
            controller: 'feedCtrl'
        });

    //$urlRouterProvider
    //     // If the url is ever invalid, e.g. '/asdf', then redirect to '/' aka the home state
    //     .otherwise('/feed');
}]);