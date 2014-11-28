appControllers.controller('leftPanelCtrl', ['$scope', '$location', 'folderFactory', '$stateParams', '$state', 'user', '$rootScope', 'twitterAccountFactory', 'appConfig', '$window',
  function ($scope, $location, folderFactory, $stateParams, $state, user, $rootScope, twitterAccountFactory, appConfig, $window) {
      $scope.loaded = false;
      $rootScope.showAllTickets = $window.localStorage.getItem(appConfig.localStorageKeyAllMySwitcher) == 'false' ? false : true;

      $scope.load = function () {
          folderFactory({ adminView: $rootScope.showAllTickets || false }).get().$promise.then(function (data) {
              $scope.loaded = true;
              $rootScope.folderStat = data;
              Tinycon.setBubble(data.attentionNeeded);
              console.log('load folders');
          });
      };

      $scope.toggleShowAll = function () {
          $rootScope.showAllTickets = !$rootScope.showAllTickets;
          $window.localStorage.setItem(appConfig.localStorageKeyAllMySwitcher, $rootScope.showAllTickets);
          $scope.load();
          $rootScope.$broadcast('event:reloadTickets');
      };

      if ($rootScope.folderStat == null) {
          $scope.load();
      }

      $rootScope.userOldId = user.profile().oldLink;

      $scope.$on('event:reloadFolders', function (event, args) {
          console.log('event:reloadFolders');
          folderFactory({ adminView: $rootScope.showAllTickets || false }).get().$promise.then(function (data) {
              $rootScope.folderStat = data;
              Tinycon.setBubble(data.attentionNeeded);
          });
      });

      $scope.showMyFolders = function () {
          return !user.profile().isAdmin ? true : !$rootScope.showAllTickets;
      }
  }]);