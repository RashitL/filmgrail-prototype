'use strict';

/* App Module */

var app = angular.module('app', [
  'ui.directives',
  'ngRoute',
  'ngAnimate',
  'ngSanitize',
  'ui.utils',
  'ui',
  'ui.directives',
  'ui.router',
  'ui.bootstrap',
  'ui.select2',
  'appControllers',
  'appServices',
  'appDirectives',
  'app.filters',
  'ngTouch',
  'fastClick',
  'monospaced.elastic',
  'angularBootstrapNavTree',
  'formstamp',
  'angularFileUpload',
  'ngTagsInput',
  'chieffancypants.loadingBar'
]).config(function (datepickerConfig, datepickerPopupConfig, $sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self',
    // Allow loading from outer templates domain.
    'https://www.facebook.com/*'
    ]);
    datepickerConfig.showWeeks = false;
    datepickerPopupConfig.toggleWeeksText = null;
}).run(
      ['$rootScope', '$state', '$stateParams', '$http', 'appConfig', 'user',
      function ($rootScope, $state, $stateParams, $http, appConfig, user) {
          $http.defaults.useXDomain = true;
          $rootScope.$state = $state;
          $rootScope.$stateParams = $stateParams;
          $rootScope.appConfig = appConfig;
          $rootScope.user = user;
          $rootScope.eSource = eSource;
          $rootScope.oldUrl = appConfig.oldUrl;
          $rootScope.tags = [];
      }]);

angular.module('fastClick', []).
run(function () {
    FastClick.attach(document.body);
});

