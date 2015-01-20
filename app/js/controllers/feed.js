appControllers.controller('feedCtrl', ['$scope', '$location', '$stateParams', '$state', '$rootScope', '$filter', '$http',
  function ($scope, $location, $stateParams, $state, $rootScope, $filter, $http) {
      $http.get('/app/js/controllers/feed.json')
         .then(function (res) {
             $scope.feed = res.data;
             $scope.feedInbox = [$scope.feed[0], $scope.feed[1]];
         });

      // init tags
      $scope.searchTags = [{ title: "Action", picture: "https://s-media-cache-ak0.pinimg.com/111x55_sf-76/84/fe/31/84fe310cfdd25d366ec571f3ab87c356.jpg" },
          { title: "Drama", picture: "https://s-media-cache-ak0.pinimg.com/111x55_sf-76/f8/7e/8d/f87e8dc1d271a1dda2420141665c32d7.jpg" },
          { title: "Comedy", picture: "http://media-cache-ak0.pinimg.com/236x/30/34/58/3034589de1269502cdf85c06925eb45e.jpg" },
          { title: "Sport", picture: "https://s-media-cache-ak0.pinimg.com/111x55_sf-76/75/63/f3/7563f3c1a6a6e2ec633aef9a993a5420.jpg" },
          { title: "For kids", picture: "https://s-media-cache-ak0.pinimg.com/111x55_sf-76/0d/57/17/0d57170c4c333d2e08f448928a980315.jpg" },
          { title: "Similar to 'Lord of the Rings", picture: "https://s-media-cache-ak0.pinimg.com/111x55_sf-76/6d/03/c0/6d03c0146c4928d13a774c906b4ba0eb.jpg" },
          { title: "X-mass", picture: "https://s-media-cache-ak0.pinimg.com/111x55_sf-76/16/8c/d4/168cd4f2a1a930baf860af911fbf9313.jpg" },
          { title: "C.Nolan", picture: "https://s-media-cache-ak0.pinimg.com/111x55_sf-76/7a/3e/c9/7a3ec9a763ce142f86f2a6a8b886fe6c.jpg" },
          { title: "C.Bale", picture: "https://s-media-cache-ak0.pinimg.com/111x55_sf-76/e6/e8/4d/e6e84de7067075403a3b7e3e4c7f5718.jpg" },
          { title: "High rating", picture: "https://s-media-cache-ak0.pinimg.com/111x55_sf-76/a6/d6/36/a6d63617dff25f0c936ad5ce30f780e2.jpg" },
          { title: "Friend liked", picture: "https://s-media-cache-ak0.pinimg.com/111x55_sf-76/3a/99/e3/3a99e3d42a6261db1210bbb7f2b7bba2.jpg" },
          { title: "Art", picture: "https://s-media-cache-ak0.pinimg.com/111x55_sf-76/19/a1/d6/19a1d65182e64ae9206fe461c5c874d2.jpg" },
          { title: "Classic", picture: "https://s-media-cache-ak0.pinimg.com/111x55_sf-76/19/c6/d6/19c6d61d64a399fe808c0ae20752011c.jpg" },
          { title: "Tarantino", picture: "https://s-media-cache-ak0.pinimg.com/111x55_sf-76/06/ca/09/06ca09e4e2145eaac76c2e9e5337abb5.jpg" }];

      $scope.genres = ["Action", "Drama", "Comedy", "Romantic", "Horror", "Musical", "Sci-Fi/ Fantasy"];
      $scope.tagList = ["Sport", "Documentary", "For kids", "X-mass", "High-tech", "C.Nolan", "J.Depp", "C.Bale", "Similar to 'Lord of the Rings'"];
      $scope.fulLTagList = ["2014", "Action - low", "Action - medium", "Action - high", "Drama - low", "Drama - medium", "Drama - high", "Comedy - low", "Comedy - medium", "Comedy - high", "High rating", "Liked by friends", "Shared by friends", "Sport", "Action with comedy", "Nolan", "Similar to 'Lord of the Rings'"];
      $scope.subTagList = [];
      $scope.tagOptions = {
          tags: function (query) {
              return $scope.fulLTagList;
          },
          tokenSeparators: [","],
          multiple: true,
          initSelection: function (element, callback) {
              callback($rootScope.tags);
          }
      };

      $scope.addTag = function (tag, subTag) {
          if (tag == "more...") {
              $scope.tagList.splice($scope.tagList.indexOf(tag), 1);
              $scope.tagList = $scope.tagList.slice().concat(["Q.Tarantino", "J.Depp"]);
              return;
          }

          //if (tag == "Action") {
          //    $scope.subTagList = ["Action - low", "Action - medium", "Action - high"];
          //    return;
          //}
          //if (tag == "Drama") {
          //    $scope.subTagList = ["Drama - low", "Drama - medium", "Drama - high"];
          //    return;
          //}
          //if (tag == "Comedy") {
          //    $scope.subTagList = ["Comedy - low", "Comedy - medium", "Comedy - high"];
          //    return;
          //}

          $scope.searchTags = Enumerable.From($scope.searchTags).Where('t=>t.title!="' + tag + '"').ToArray();

          var tags = [{ id: tag, text: tag }].concat($scope.tags.reverse()).reverse();
          $rootScope.tags = tags;

          $scope.feed = Enumerable.From($scope.feed).Shuffle().ToArray();
          $scope.subTagList = [];

          $scope.tagList = Enumerable.From($scope.tagList).Shuffle().ToArray();
      };

      $scope.reset = function () {
          $rootScope.tags = [];
          $scope.feed = Enumerable.From($scope.feed).Shuffle().ToArray();
          $scope.subTagList = [];
      };
  }]);