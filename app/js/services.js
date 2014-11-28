'use strict';

/* Services */

var appServices = angular.module('appServices', ['ngResource']);

toastr.options.timeOut = 5000;
toastr.options.fadeOut = 250;
toastr.options.fadeIn = 250;
toastr.options.newestOnTop = false;
toastr.closeButton = true;

appServices.factory('notificationFactory', function () {
    return {
        updating: function () {
            toastr.info("Updating...");
        },
        updated: function () {
            toastr.success("Updated");
        },
        error: function (text) {
            toastr.error(text, "Error");
        }
    };
});

appServices.factory('categoryFactory', ['$resource', 'appConfig',
    function ($resource, appConfig) {
        return function (params) {
            return $resource(appConfig.apiUrl + '/category/', params == null ? {} : params,
                {
                    query: { method: 'GET', isArray: true }
                }
            );
        };
    }]);

appServices.factory('kloutFactory', ['$resource',
    function ($resource) {
        return function (param) {
            var api = "https://api.fullcontact.com/v2/person.json";
            var params = { apiKey: '9a102d3eb3c43291' };
            switch (param.source) {
                case eSource.facebook:
                    if (param.user.link == null) {
                        params.email = param.user.email;
                    }
                    else {
                        params.facebookId = param.user.link.split("id=")[1];
                    }
                    break;
                default:
                    params.email = param.user.email;
                    break;
            }

            return $resource(api, params,
                {
                    get: { method: 'GET', isArray: false }
                }
            );
        };
    }]);

appServices.factory('userFactory', ['$resource', 'appConfig',
    function ($resource, appConfig) {
        return function (keyWords) {
            return $resource(appConfig.apiUrl + '/user/', { keyWord: keyWords },
                {
                    query: { method: 'GET', isArray: true }
                }
            );
        };
    }]);

appServices.factory('ticketFactory', ['$resource', 'appConfig',
    function ($resource, appConfig) {
        return function (params) {
            return $resource(appConfig.apiUrl + '/ticket/:ticketId', params == null ? {} : params,
                {
                    query: { method: 'GET', isArray: true },
                    save: {
                        method: 'POST'
                    }
                }
            );
        };
    }]);

appServices.factory('ticketSaveFactory', ['$http', 'appConfig', '$rootScope', function ($http, appConfig, $rootScope) {
    return {
        save: function (ticket) {
            return $http.post(appConfig.apiUrl + '/ticket', ticket);
        },
        assign: function (toShare) {
            return $http.post(appConfig.apiUrl + '/AssignTicket', toShare);
        },
        comments: function (comments, ticketId) {
            return $http.post(appConfig.apiUrl + '/comments/' + ticketId, comments);
        },
        properties: function (properties, ticketId) {
            return $http.post(appConfig.apiUrl + '/properties/' + ticketId, properties);
        },
        archive: function (ticketId, isArchived) {
            return $http.post(appConfig.apiUrl + '/archive/?ticketId=' + ticketId + '&isArchived=' + isArchived);
        },
        setNeedsAttention: function (ticketId, isAttentionNeeded) {
            return $http.post(appConfig.apiUrl + '/needAttention/?ticketId=' + ticketId + '&isAttentionNeeded=' + isAttentionNeeded);
        },
        lockTicket: function (ticketId, isLocked) {
            return $http.post(appConfig.apiUrl + '/ticketLock/?ticketId=' + ticketId + '&isLocked=' + isLocked);
        }
    };
}]);

appServices.factory('ticketReplyFactory', ['$http', 'appConfig', '$rootScope', function ($http, appConfig, $rootScope) {
    return {
        addReply: function (ticketId, parentReplyId, reply) {
            var isAutoArchive = $rootScope.ticket.isAutoArchive;
            $rootScope.ticket.isAutoArchive = false;
            var replyModel = {
                message: reply,
                action: 1,
                isArchived: isAutoArchive || false,
                parentId: parentReplyId
            };
            return $http.post(appConfig.apiUrl + '/replies/' + ticketId, replyModel);
        },
        updateReply: function (ticketId, parentReplyId, reply) {
            var replyModel = {
                message: reply,
                action: 2,
                isArchived: false,
                parentId: parentReplyId
            };
            return $http.post(appConfig.apiUrl + '/replies/' + ticketId, replyModel);
        },
        deleteReply: function (ticketId, parentReplyId, replyId) {
            var replyModel = {
                action: 3,
                isArchived: false,
                parentId: parentReplyId,
                message: { id: replyId }
            };
            return $http.post(appConfig.apiUrl + '/replies/' + ticketId, replyModel);
        },
    };
}]);

appServices.factory('likeChangeFactory', ['$resource', 'appConfig',
    function ($resource, appConfig) {
        return function (ticket) {
            return $resource(appConfig.apiUrl + '/like/', ticket,
                {
                    toggle: { method: 'POST' }
                }
            );
        };
    }]);

appServices.factory('folderFactory', ['$resource', 'appConfig',
    function ($resource, appConfig) {
        return function (params) {
            return $resource(appConfig.apiUrl + '/folder/', params == null ? {} : params, {}
            );
        };
    }]);

appServices.factory('twitterAccountFactory', ['$resource', 'appConfig',
    function ($resource, appConfig) {
        return function (params) {
            return $resource(appConfig.apiUrl + '/twitterAcount/', params == null ? {} : params, {}
            );
        };
    }]);

appServices.factory('tagFactory', ['$resource', 'appConfig',
    function ($resource, appConfig) {
        return function (params) {
            return $resource(appConfig.apiUrl + '/tags/', params == null ? {} : params, {}
            );
        };
    }]);

appServices.factory('logFactory', ['$resource', 'appConfig',
    function ($resource, appConfig) {
        return function (params) {
            return $resource(appConfig.apiUrl + '/log/', params == null ? {} : params, {}
            );
        };
    }]);

appServices.factory('likeFactory', ['$resource', 'appConfig',
    function ($resource, appConfig) {
        return function (params) {
            return $resource(appConfig.apiUrl + '/like/', params == null ? {} : params, {}
            );
        };
    }]);

appServices.factory('followFactory', ['$http', 'appConfig', function ($http, appConfig) {
    return {
        save: function (ticket) {
            return $http.post(appConfig.apiUrl + '/TwitterFollow', ticket);
        }
    };
}]);