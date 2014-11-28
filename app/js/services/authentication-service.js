'use strict';

app.value("appConfig",
    {
        protectAllRoutes: true,
        localStorageKey: "auth:sessions",
        localStorageKeyCommunity: "community",
        localStorageKeyAllMySwitcher: "myAll",
        authorizeUrl: "/account",
        authorizeUrlWithToken: "/directaccess",
        apiUrlBase: 'http://socialboards2013.cloudapp.net',
        apiUrl: 'http://socialboards2013.cloudapp.net/api',
        successUrl: "/",
        loginState: "community.login",
        redirectUrl: "",
        oldUrl: 'http://dev.socialboards.no'
    });

app.factory("user", ['$http', '$q', '$window', 'appConfig', '$state', '$stateParams',
    function ($http, $q, $window, appConfig, $state, $stateParams) {
        var object = {
            session: {},
            authorize: function (credentials) {
                var data = $.param(credentials);
                return $http({
                    method: 'POST',
                    url: appConfig.apiUrl + appConfig.authorizeUrl,
                    data: data,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                })
                    .success(function (res) {
                        object.session = res;

                        $window.localStorage.setItem(appConfig.localStorageKey, JSON.stringify(object.session));

                        if (appConfig.returnState == null) {
                            $state.go('community.folder', { folder: 'needs-attention' });
                        } else {
                            $state.go(appConfig.returnState, appConfig.returnParams);

                        }
                    })
                    .error(function (res) {
                        $q.reject(res.status);
                    });
            },
            authorizeWithToken: function (token, callback) {
                var data = $.param({ token: token });
                return $http({
                    method: 'POST',
                    url: appConfig.apiUrl + appConfig.authorizeUrlWithToken,
                    data: data,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                })
                    .success(function (res) {
                        res.community = $stateParams.community;
                        object.session = res;
                        $window.localStorage.setItem(appConfig.localStorageKey, JSON.stringify(object.session));
                        
                        callback();
                    })
                    .error(function (res) {
                        $q.reject(res.status);
                    });
            },
            token: function () {
                return object.session ? object.session.token : null;
            },
            info: function () {
                return object.session ? object.session.userInfo : null;
            },
            logOff: function () {
                $window.localStorage.removeItem(appConfig.localStorageKey);
                $window.localStorage.removeItem(appConfig.localStorageKeyCommunity);
                object.session = null;
                $('#menuModal').modal('hide');
                //setTimeout(function () { $state.go(appConfig.loginState) }, 400);
            },
            authorized: function () {
                return object.session !== null;
            },
            profile: function () {
                return object.session.userInfo;
            },
        };

        var sessionString = $window.localStorage.getItem(appConfig.localStorageKey);
        if (sessionString) {
            object.session = JSON.parse(sessionString);
        }
        else {
            object.session = null;
        }

        return object;
    }]);

// add interceptor into httpProvider for adding 'X-Token' header into all requests; 
app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push(function ($injector, $q, $rootScope, $stateParams) {
        return {
            request: function (config) {
                var user = $injector.get('user');
                if (user.authorized() && config.url.indexOf('fullcontact') < 1) {
                    config.headers["X-Token"] = user.token();
                    config.headers["Community"] = $stateParams.community;
                    config.headers["Token-Type"] = $stateParams.token == null ? 0 : 1;
                }
                return config;
            },
            responseError: function (rejection) {
                
                var user = $injector.get("user");
                if (rejection.status === 401) {
                    if (user.authorized()) user.logOff();
                    $rootScope.$broadcast('event:wrongCredentials', rejection.data);
                }
                if (rejection.status === 400) {
                    user.logOff();
                }
                if (rejection.status === 500) {
                    var notificationFactory = $injector.get("notificationFactory");
                    notificationFactory.error('Oops...Something went wrong, please try again or reload this page');
                }
                $q.reject(rejection);
            }
        };
    });
}]);

// checking authorization
appServices.run(function ($rootScope, user, appConfig, $state, $stateParams) {
    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
        var all = appConfig.protectAllRoutes;
        var one = toState ? toState.protected : void 0;
        if ((all !== false) || (!all && one === true)) {
            if (!user.authorized() && toParams.token == null) {
                

                if (toState.name === appConfig.loginState)
                    return void 0;
                appConfig.returnParams = toParams;
                appConfig.returnState = toState;
                //$state.go(appConfig.loginState, toParams);
                event.preventDefault();
            }
        }
    });
});

