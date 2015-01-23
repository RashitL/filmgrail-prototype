appControllers.controller('collectionsCtrl', ['$scope', '$location', '$stateParams', '$state', '$rootScope', '$filter', '$http',
  function ($scope, $location, $stateParams, $state, $rootScope, $filter, $http) {
      $http.get('/app/js/controllers/collections.json')
         .then(function (res) {
             $scope.feed = res.data;
         });
  }]);