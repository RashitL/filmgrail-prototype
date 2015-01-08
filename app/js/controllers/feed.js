appControllers.controller('feedCtrl', ['$scope', '$location', '$stateParams', '$state', '$rootScope', '$filter', '$http',
  function ($scope, $location, $stateParams, $state, $rootScope, $filter, $http) {
      $http.get('/app/js/controllers/feed.json')
         .then(function (res) {
             $scope.feed = res.data;
         });

      // init tags
      $scope.genres = ["Action", "Drama", "Comedy", "Romantic", "Horror", "Musical", "Sci-Fi/ Fantasy"];
      $scope.tagList = ["Sport", "Documentary", "For kids","X-mass","High-tech", "C.Nolan", "J.Depp", "C.Bale", "Similar to 'Lord of the Rings'"];
      $scope.fulLTagList = ["2014", "Action - low", "Action - medium", "Action - high", "Drama - low", "Drama - medium", "Drama - high", "Comedy - low", "Comedy - medium", "Comedy - high", "High rating", "Liked by friends", "Shared by friends", "Sport", "Action with comedy", "Nolan"];
      $scope.subTagList = [];
      $scope.tags = [];
      $scope.tagOptions = {
          tags: function (query) {
              return $scope.fulLTagList;
          },
          tokenSeparators: [","],
          multiple: true,
          initSelection: function (element, callback) {
              callback($scope.tags);
          }
      };

      $scope.addTag = function (tag, subTag) {
          if (tag == "more...") {
              $scope.tagList.splice($scope.tagList.indexOf(tag), 1);
              $scope.tagList = $scope.tagList.slice().concat(["Q.Tarantino", "J.Depp"]);
              return;
          }

          if (tag == "Action") {
              $scope.subTagList = ["Action - low", "Action - medium", "Action - high"];
              return;
          }
          if (tag == "Drama") {
              $scope.subTagList = ["Drama - low", "Drama - medium", "Drama - high"];
              return;
          }
          if (tag == "Comedy") {
              $scope.subTagList = ["Comedy - low", "Comedy - medium", "Comedy - high"];
              return;
          }

          var tags = [{ id: tag, text: tag }].concat($scope.tags.reverse()).reverse();
          $scope.tags = tags;

          $scope.feed = Enumerable.From($scope.feed).Shuffle().ToArray();
          $scope.subTagList = [];
      };

      $scope.resetTags = function () {
          $scope.tags = [];
          $scope.feed = Enumerable.From($scope.feed).Shuffle().ToArray();
          $scope.subTagList = [];
      };


  }]);