appControllers.controller('feedCtrl', ['$scope', '$location', '$stateParams', '$state', '$rootScope', '$filter', '$http',
  function ($scope, $location, $stateParams, $state, $rootScope, $filter, $http) {
      $http.get('/app/js/controllers/feed.json')
         .then(function (res) {
             $scope.feed = res.data;
         });

      // init tags
      $scope.tagList = ["2014", "Action", "Drama", "Comedy", "High rating", "Liked by friends", "Shared by friends", "Sport", "more..."];
      $scope.fulLTagList = ["2014", "A bit of action", "Action movie", "Lots of action", "A bit of Drama", "Drama movie", "Make me cry", "A bit of Comedy", "Comedy movie", "Super funny", "High rating", "Liked by friends", "Shared by friends", "Sport", "Action with comedy", "Nolan"];
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
              $scope.subTagList = ["A bit of action", "Action movie", "Lots of action"];
              return;
          }
          if (tag == "Drama") {
              $scope.subTagList = ["A bit of Drama", "Drama movie", "Make me cry"];
              return;
          }
          if (tag == "Comedy") {
              $scope.subTagList = ["A bit of Comedy", "Comedy movie", "Super funny"];
              return;
          }

          var tags = [{ id: tag, text: tag }].concat($scope.tags.reverse()).reverse();
          $scope.tags = tags;

          $scope.feed = Enumerable.From($scope.feed).Shuffle().ToArray();
          $scope.subTagList = [];
      };


  }]);