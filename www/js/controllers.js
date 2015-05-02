angular.module("starter.controllers", [])
    .controller("FeedCtrl", function ($scope, $stateParams, $http, appConfig, $ionicLoading, $ionicPopover) {
        
        













    })
    .controller("SearchCtrl", function ($scope, $stateParams, $http, appConfig, $ionicLoading, $ionicPopover) {
        $ionicPopover.fromTemplateUrl('templates/popover.html', {
            scope: $scope
        }).then(function (popover) {
            $scope.popover = popover;
        });
        $scope.openPopover = function ($event) {
            $scope.popover.show($event);
        };
        $scope.closePopover = function () {
            $scope.popover.hide();
        };
        //Cleanup the popover when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.popover.remove();
        });
        // Execute action on hide popover
        $scope.$on('popover.hidden', function () {
            // Execute action
        });
        // Execute action on remove popover
        $scope.$on('popover.removed', function () {
            // Execute action
        });

        $scope.superModel = { searchText: "", totalMovies: 0 };
        $scope.loadData = function () {
            //$http.get(appConfig.apiUrl).
            //    success(function(data, status) {
            //        $scope.feed = data;
            //    }).finally(function() {
            //        // Stop the ion-refresher from spinning
            //        $scope.$broadcast('scroll.refreshComplete');
            //    });

            $ionicLoading.show({
                template: 'Loading...', noBackdrop: true, delay: 300,
            });

            $http.get("http://filmgrail.com:8001/apiv2/SearchMovie/Search/Get?Action=0&Atmosphere=0&Comedy=0&Drama=0&EndYear=2015&Horror=0&KeyWords=" + $scope.superModel.searchText + "&Musical=0&Mystical=0&Rating=6.0&Romantic=0&Sad=0&Skip=0&StartYear=1930&Suspense=0&Take=40&loadingMoreMovies=false").
                success(function (data, status) {
                    $scope.feed = data.Movies;
                    $scope.tags = $scope.superModel.searchText == '' ? [{ Title: 'In-cinemas' }, { Title: 'Streaming' }, { Title: 'On-tv' }] : data.Tags;
                    $scope.superModel.totalMovies = data.Total;
                }).finally(function () {
                    // Stop the ion-refresher from spinning
                    $scope.$broadcast('scroll.refreshComplete');
                    $ionicLoading.hide();
                });
        };

        $scope.getPoster = function (poster) {
            return poster;
        };

        $scope.items = [{ data: "This is something" }, { data: "something else" }, { data: "another thing" }, { data: "it keeps going" }, { data: "seemingly forever..." }, { data: "and forever..." }, { data: "and forever..." }, { data: "and forever..." }, { data: "and forever..." }, { data: "and forever..." }, { data: "and forever..." }];

        $scope.loadData();

        $scope.addTag = function (newTag) {
            $scope.superModel.searchText += ' ' + newTag;
            $scope.loadData();
        };
    })
    .controller("SnapEventCtrl", function ($scope, $stateParams) {
        //--
    })
    .controller("ActivityCtrl", function ($scope) {
        //--
    })
    .controller("EventDetailCtrl", function ($scope, $stateParams, $http, appConfig) {
        $http.get(appConfig.apiUrl + '&q={"Id":"' + $stateParams.eventId + '"}').
        success(function (data, status) {
            $scope.event = data[0];
        });
    })
    .controller("AccountCtrl", function($scope) {
        $scope.settings = {
            enableFriends: true
        };
    })

.controller('BrowseCtrl', function ($scope, $http) {
    $http.get("http://filmgrail.com:8001/apiv2/SearchMovie/Search/Get?Action=0&Atmosphere=0&Comedy=0&Drama=0&EndYear=2015&Horror=0&KeyWords=on-tv&Musical=0&Mystical=0&Rating=6.0&Romantic=0&Sad=0&Skip=0&StartYear=1930&Suspense=0&Take=40&loadingMoreMovies=false").
                success(function (data, status) {
                    $scope.movies = data.Movies;
                    
                }).finally(function () {
                    // Stop the ion-refresher from spinning
                    $scope.$broadcast('scroll.refreshComplete');
                });
});