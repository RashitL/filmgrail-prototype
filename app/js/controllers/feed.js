appControllers.controller('feedCtrl', ['$scope', '$location', '$stateParams', '$state', '$rootScope', '$filter', '$http',
  function ($scope, $location, $stateParams, $state, $rootScope, $filter, $http) {
      $http.get('/app/js/controllers/feed.json')
         .then(function (res) {
             $scope.feed = res.data;
         });

      // init tags
      $scope.tagList = ["2014", "Action", "Drama", "Comedy", "Liked by friends", "High rating", "On TV", "In cinemas", "On NetFlix"];
      $scope.tags = [];
      $scope.tagOptions = {
          tags: function (query) {
              return $scope.tagList;
          },
          tokenSeparators: [","],
          multiple: true,
          initSelection: function (element, callback) {
              callback($scope.tags);
          },
          width: "730px"
      };

      $scope.addTag = function (tag) {
          var tags = [{ id: tag, text: tag }].concat($scope.tags.reverse()).reverse();
          $scope.tags = tags;

          $scope.feed = Enumerable.From($scope.feed).Shuffle().ToArray();

      };
  }]);