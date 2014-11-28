appControllers.controller('loginCtrl', ['$scope', '$stateParams', '$state', '$rootScope', 'user', 'appConfig', '$http', '$window',
  function ($scope, $stateParams, $state, $rootScope, user, appConfig, $http, $window) {
      //$scope.email = "";
      //$scope.password = "";
      $scope.community = $stateParams.community || $window.localStorage.getItem(appConfig.localStorageKeyCommunity);

      if ($scope.community != null && $scope.community.length > 0 && user.authorized()) {
          $stateParams.community = $scope.community;
          $state.go("community.folder", $stateParams, { notify: true });
          return 0;
      }

      $scope.login = function () {
          $window.localStorage.setItem(appConfig.localStorageKeyCommunity, $scope.community || "");
          $scope.loggingIn = true;
          $stateParams.community = $scope.community;
          $state.go("community.folder", $stateParams, { notify: false });
          user.authorize({ username: $scope.email, password: $scope.password, community: $scope.community });
      };

      $scope.$on('event:wrongCredentials', function (event, args) {
          $scope.errorMessage = args;
          $scope.loggingIn = false;
      });

      $scope.remindPassword = function () {
          $scope.loggingIn = true;
          $http.post(appConfig.apiUrl + '/password/', { UserName: $scope.email, Community: $stateParams.community }).success(function (data, status) {
              console.log(status);
              console.log(data);
              $scope.loggingIn = false;

              if (data == "\"email doen't exist in db\"") {
                  alert('Error: Email does not exist in the database!');
              } else {
                  $scope.showForgotPswd = false;
              }
          });
      };

      $window.localStorage.setItem(appConfig.localStorageKeyCommunity, $scope.community || "");

  }]);