appControllers.controller('ticketListCtrl', ['$scope', '$location', 'ticketFactory', '$stateParams', '$state', '$rootScope', '$filter', 'categoryFactory', 'user',
  function ($scope, $location, ticketFactory, $stateParams, $state, $rootScope, $filter, categoryFactory, user) {
      $scope.community = $stateParams.community;

      $rootScope.isDetailView = false;
      $('#ticketDetail').hide();
      $('#ticketList').show();
      $('#ticketList').removeClass('col-sm-5');
      $('#ticketList').addClass('col-sm-12');
      $scope.loaded = false;
      $scope.searching = false;
      $scope.refreshing = false;
      $scope.loadingMore = false;
      $scope.loadedAllTickets = false;
      $scope.skip = 0;
      $scope.count = 15;

      $scope.refreshPromt = false;

      if ($scope.shared.categories.length == 0) {
          categoryFactory().query().$promise.then(function (data) {
              $scope.shared.categories = data;
          });
      }

      $scope.searchKeyWords = function () {
          $scope.searching = true;
          clearTimeout($scope.updateTimer);
          $scope.updateTimer = setTimeout(function () {
              $scope.reload();
              console.log('aaaa1111');
          }, 500);
      };

      function getParams() {
          return {
              count: $scope.count, skip: $scope.skip,
              folder: eFolder[$stateParams.folder],
              sentiment: eSentiments[$stateParams.sentiment],
              source: eSource[$stateParams.source],
              visibility: eVisibility[$stateParams.visibility],
              category: $stateParams.category == "" || $stateParams.category == null ? "" : $stateParams.category.split("--")[1],
              orderBy: eOrderBy[$stateParams.orderBy],
              keyWord: encodeURIComponent($scope.shared.keyWord) || '',
              adminView: $rootScope.showAllTickets || false
          };
      }
      if ($stateParams.visibility != null) {
          ticketFactory(getParams()).query().$promise.then(function (data) {
              $scope.loaded = true;
              // tickets
              $rootScope.tickets = $scope.tickets = data;
              // search and sorting
              $scope.searchText = null;
          });
      }


      $scope.loadMore = function () {
          $scope.skip += $scope.count;
          $scope.loadingMore = true;
          ticketFactory(getParams()).query().$promise.then(function (data) {
              // tickets
              if (data.length == 0) {
                  $scope.loadedAllTickets = true;
              } else {
                  $rootScope.tickets = $scope.tickets = $scope.tickets.concat(data);
              }
              $scope.loadingMore = false;
          });
      };

      $scope.getSentiment = function (sentiment) {
          return eSentiments[sentiment];
      };

      $scope.reload = function (reloadFolders) {
          console.log('event: reloadTickets');
          $scope.refreshPromt = false;
          $scope.skip = 0;
          $scope.count = 15;
          $scope.loadedAllTickets = false;
          $scope.refreshing = true;
          ticketFactory(getParams()).query().$promise.then(function (data) {
              $scope.refreshing = false;
              $scope.searching = false;
              // tickets
              $rootScope.tickets = $scope.tickets = data;
              // search and sorting
              $scope.searchText = null;
          });
          if (reloadFolders) {
              console.log('event: reloadFolders : reloadTickets');
              $rootScope.$broadcast('event:reloadFolders');
          }
      };

      $scope.$on('event:refreshPromt', function (event, args) {
          $scope.refreshPromt = true;
      });

      $scope.$on('event:reloadTickets', function (event, args) {
          $scope.reload();
      });

      $scope.$on('event:newticket', function (event, args) {
          ticketFactory(getParams()).query().$promise.then(function (data) {
              // tickets
              if (!Enumerable.From($rootScope.tickets).Any('t=>t.id==' + data[0].id) && data[0].id != $rootScope.tickets[0].id) {
                  data[0].isNew = true;
                  $scope.tickets.unshift(data[0]);
                  $rootScope.tickets = $scope.tickets;
              }
          });
      });

      $scope.getFilters = function () {
          if ($stateParams.visibility == null) {
              return "";
          }
          if ($state.includes("community.folder.detail")) {
              var count = 0;
              if ($stateParams.visibility != '') count++;
              if ($stateParams.category != '') count++;
              return count == 0 ? "" : "(" + count + ")";
          }

          var result = "(";

          if ($stateParams.visibility != '') {
              if (result != "(") {
                  result += ", ";
              }
              result += $stateParams.visibility;
          }

          if ($stateParams.category != '') {
              if (result != "(") {
                  result += ", ";
              }
              result += $filter('limitString')($filter('cutCategoryId')($stateParams.category));
          }

          result += ")";

          return result == "()" ? "" : result;
      };
  }]);