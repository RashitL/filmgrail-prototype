'use strict';

/* Controllers */

var appControllers = angular.module('appControllers', ['ngSanitize']);

appControllers.controller('mainCtrl', ['$scope', '$location', 'ticketFactory', '$stateParams', '$state', '$rootScope', '$filter', 'categoryFactory',
  function ($scope, $location, ticketFactory, $stateParams, $state, $rootScope, $filter, categoryFactory) {
      $scope.shared = {keyWord:''};
      $scope.shared.categories = [];
  }]);