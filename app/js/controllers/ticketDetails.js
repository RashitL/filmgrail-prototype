appControllers.controller('ticketDetailCtrl', ['$scope', '$routeParams', 'ticketFactory', 'ticketSaveFactory', '$stateParams', '$rootScope', '$http', 'notificationFactory', 'appConfig', 'kloutFactory', 'user', '$modal', '$location', 'likeFactory', 'likeChangeFactory', '$state', 'followFactory', 'tagFactory', 'logFactory', '$window', 'ticketReplyFactory',
function ($scope, $routeParams, ticketFactory, ticketSaveFactory, $stateParams, $rootScope, $http, notificationFactory, appConfig, kloutFactory, user, $modal, $location, likeFactory, likeChangeFactory, $state, followFactory, tagFactory, logFactory, $window, ticketReplyFactory) {
    console.log($scope.ticket);
    console.log('2222222');
    $scope.threadCollapsed = true;
    $scope.currentViewedUser = null;
    $scope.currentViewedUserInfoKlout = {};
    $scope.newAttachments = [];
    $scope.takeReplies = 0;
    $rootScope.reloading = false;
    $scope.ticket = { tags: [] };
    // load aprt of ticket details from the list ticket 
    $rootScope.ticket = $scope.ticket = Enumerable.From($scope.tickets).Where("t=>t.id==" + $stateParams.ticketId).FirstOrDefault() || { tags: [] };
    if ($scope.ticket != null) {
        $scope.threadCollapsed = $scope.ticket.messageCount > 2;
    };

    $scope.fb = function () {
        return ($scope.ticket == null || $scope.ticket.source == null || $scope.ticket.source == 'undefined' || $scope.ticket.source == eSource.facebook || $scope.ticket.source == eSource.twitter);
    };

    $scope.twitter = function () {
        return ($scope.ticket == null || $scope.ticket.source == eSource.twitter);
    };

    $scope.email = function () {
        return ($scope.ticket == null || $scope.ticket.source == eSource.email);
    };

    $scope.noAvatar = "http://www.etceter.com/assets/43b442c6/no_avatar_available.jpg";
    $scope.noImage = "http://cdn.panasonic.com/images/imageNotFound400.jpg";

    $scope.followTwitterUser = function (follow) {
        follow.status = !follow.status;
        followFactory.save({ followerUsername: follow.followerUsername, followingUsername: follow.followingUsername, status: follow.status });
    };

    function calcTime(city) {
        var offset = 3;
        // create Date object for current location
        d = new Date();

        // convert to msec
        // add local time zone offset
        // get UTC time in msec
        utc = d.getTime() + (d.getTimezoneOffset() * 60000);

        // create new Date object for different city
        // using supplied offset
        nd = new Date(utc + (3600000 * offset));

        // return time as a string
        return nd.toJSON();

    }

    $rootScope.isDetailView = true;
    $('#ticketDetail').show();
    $('#ticketList').removeClass('col-sm-12');
    $('#ticketList').addClass('col-sm-5');

    if (jQuery.browser.mobile) {
        $('#ticketList').hide();
    }

    $scope.watchers = [];

    $scope.addWatchers = function () {
        addWatcherForTicket('tags', $scope.ticket, ticketSaveFactory.save);
        addWatcherForTicket('noteCount', $scope.ticket.comments, ticketSaveFactory.comments);
        addWatcherForTicket('properties', $scope.ticket.properties, ticketSaveFactory.properties);
    }

    $scope.clearWatchers = function () {
        angular.forEach($scope.watchers, function (value, key) {
            value();
        });
    }

    $scope.isOneTime = function () {
        return $stateParams.token != null;
    }

    $scope.mobile = jQuery.browser.mobile;

    $scope.loaded = $scope.ticket != null;
    $scope.loadedThread = false;
    $scope.unAnsweredCount = 0;

    function initTicketReplyUser() {
        if ($scope.twitter()) {
            $scope.newReply = $scope.ticket.usersToMention.join(' ') + ' ';
        }
    }

    $scope.getUnAnsweredCount = function () {
        if ($scope.ticket.replies.length == 0) return 0;
        var count = 0;
        var latestId = 0;
        var latestTime = $scope.ticket.replies[0].creationTime;
        angular.forEach($scope.ticket.replies, function (value, key) {
            if (value.creationTime > latestTime) {
                latestTime = value.creationTime;
                latestId = value.id;
            }
            if (value.comments.length > 0) {
                var comment = Enumerable.From(value.comments).LastOrDefault();
                if (!comment.isFromStaff) {
                    count = count + 1;
                    comment.showBold = true;
                }

                if (comment.creationTime > latestTime) {
                    latestTime = comment.creationTime;
                    latestId = value.id;
                }
            }
        });
        $scope.latestId = latestId;
        return count;
    };

    function copyPropsToListTicket() {
        angular.forEach($rootScope.tickets, function (value, key) {
            if (value.id == $stateParams.ticketId) {
                value.isAttentionNeeded = $scope.ticket.isAttentionNeeded;
                value.isLocked = $scope.ticket.isLocked;
                value.properties = $scope.ticket.properties;
                value.messageCount = $scope.ticket.messageCount;
                return 0;
            }
        });
    }

    function loadTicket() {
        $scope.updatingTicket = true;
        $scope.refreshTicketPromt = false;
        $scope.refreshTicketPromtForThread = false;
        ticketFactory().get({ ticketId: $stateParams.ticketId }, function (ticket) {
            $scope.threadCollapsed = ticket.messageCount > 2;
            $scope.loadedThread = $scope.loaded = true;
            $rootScope.ticket = $scope.ticket = ticket;
            initTicketReplyUser();
            $scope.addWatchers();
            appConfig.accounts = $scope.ticket.twitterAccounts;
            $scope.twitterAccount = appConfig.accounts[appConfig.accounts.indexOf($scope.ticket.savedBy)];
            $scope.updatingTicket = false;
            $scope.unAnsweredCount = $scope.getUnAnsweredCount();
            copyPropsToListTicket();
        });
    }



    if (($stateParams.token != null && !user.authorized()) || ($scope.isOneTime() && $stateParams.token != user.token())) {
        $window.localStorage.removeItem(appConfig.localStorageKey);
        console.log('11111111111');
        if ($scope.ticket.creationTime == null)
            user.authorizeWithToken($stateParams.token, loadTicket);
    } else {
        loadTicket();
    }

    function addWatcherForTicket(parameter, field, updateMethod) {
        $scope.watchers.push($scope.$watch('ticket.' + parameter, function (newValue, oldValue) {
            if (newValue != oldValue) {
                if ($rootScope.reloading == false) {
                    $scope.updatingTicket = true;
                    updateMethod(field, $scope.ticket.id).success(function (data, status) {
                        $scope.updatingTicket = false;
                    });
                }
                copyPropsToListTicket();
            }
        }, true));
    }

    $scope.backToList = function () {
        $('#ticketList').show();
        $('#ticketDetail').hide();
    };

    $scope.tags = [];

    $scope.tagOptions = {
        tags: function (query) {
            tagFactory().query({ keyword: query.term }, function (tags) {
                query.callback({ results: tags });
            });
        },
        tokenSeparators: [",", " "],
        multiple: true,
        initSelection: function (element, callback) {
            callback($scope.ticket.tags);
        },
        width: "300px"
    };

    $scope.addNote = function () {
        $scope.ticket.comments.push({ user: user.profile(), message: $scope.newNote, creationTime: calcTime(new Date()), isUpdatable: true });
        $scope.newNote = "";
        $scope.ticket.noteCount = $scope.ticket.comments.length;
    };

    $scope.deleteNote = function (comment) {
        $scope.ticket.comments.splice($scope.ticket.comments.indexOf(comment), 1);
        $scope.ticket.noteCount = $scope.ticket.comments.length;
    };



    function deleteFromList() {
        if (Enumerable.From($scope.$parent.tickets).Where('t=>t.id==' + $scope.ticket.id).Any()) {
            $scope.$parent.tickets.splice($scope.$parent.tickets.indexOf(Enumerable.From($scope.$parent.tickets).Where('t=>t.id==' + $scope.ticket.id).FirstOrDefault()), 1);
        }
    }

    $scope.toogleNeedsAttention = function () {
        if ($scope.ticket.isArchived || $scope.ticket.properties.isTrash) {
            alert('The ticket is archived or deleted. Please restore it before you change its properties');
            return 0;
        }
        $scope.needAttentionInProgress = true;

        ticketSaveFactory.setNeedsAttention($scope.ticket.id, !$scope.ticket.isAttentionNeeded).success(function (data, status) {
            $scope.ticket.isAttentionNeeded = !$scope.ticket.isAttentionNeeded;
            copyPropsToListTicket();
            $scope.needAttentionInProgress = false;
        });

        if (!$scope.ticket.isAttentionNeeded && $stateParams.folder == "needs-attention") {
            deleteFromList();
        }
    };

    $scope.restore = function () {
        if ($scope.ticket.isArchived) {
            ticketSaveFactory.archive($scope.ticket.id, false).success(function (data, status) {
                $scope.ticket.isArchived = false;
            });
        }
        if ($scope.ticket.properties.isTrash) {
            $scope.ticket.properties.isTrash = false;
        }
    };

    $scope.archive = function () {
        ticketSaveFactory.archive($scope.ticket.id, true).success(function (data, status) {
            $scope.ticket.isArchived = true;
            $scope.ticket.isAttentionNeeded = false;
            $scope.ticket.isLocked = false;
            $scope.ticket.lockedBy = null;
            copyPropsToListTicket();
        });
        deleteFromList();
    };

    $scope.delete = function () {
        $scope.ticket.properties.isTrash = !$scope.ticket.properties.isTrash;
        $scope.ticket.isAttentionNeeded = false;
        deleteFromList();
    };

    $scope.selectUsersToShareComment = function (comment) {
        var modalInstance = $modal.open({
            templateUrl: 'app/partials/ticket/detail/selectUsers.cshtml',
            controller: 'selectUsersCtrl',
            resolve: {
                title: function () {
                    return 'Share with socialBoards users or external collaborators';
                },
                okBtnTitle: function () {
                    return 'Share';
                },
                comment: function () {
                    return comment.message;
                },
                assignedUsers: function () {
                    return [];
                }
            }
        });

        modalInstance.result.then(function (result) {
            comment.isUpdatable = false;

            if (comment.usersSentTo == null) {
                comment.usersSentTo = [];
            }
            comment.usersSentTo = comment.usersSentTo.concat(result.users);
            comment.message = result.message;
            ticketSaveFactory.comments($scope.ticket.comments, $scope.ticket.id);
        }, function () { });
    };

    $scope.selectUsersToAssign = function () {
        var modalInstance = $modal.open({
            templateUrl: 'app/partials/ticket/detail/selectUsers.cshtml',
            controller: 'selectUsersCtrl',
            resolve: {
                title: function () {
                    return 'Assign this ticket to socialBoards users or external collaborators';
                },
                okBtnTitle: function () {
                    return 'Assign';
                },
                comment: function () {
                    return 'Hi, could you take a look at this case?';
                },
                assignedUsers: function () {
                    return $scope.ticket.assignedUsers;
                }
            }
        });

        modalInstance.result.then(function (result) {
            $scope.ticket.assignedUsers = $scope.ticket.assignedUsers.concat(result.users);
            ticketSaveFactory.assign({ ticketId: $scope.ticket.id, message: result.message, forwardedBy: user.profile(), forwardedTo: result.users });
        }, function () { });
    };



    $scope.addNewComment = function (reply, asDraft, isArchive) {
        if (asDraft) {
            $scope.ticket.properties.hasDraft = true;
        }
        $scope.ticket.isArchived = $scope.ticket.isAutoArchive = isArchive;

        var newCommentReply = { isFromStaff: true, justPosted: true, isDraft: asDraft, user: user.profile(), message: reply.newComment, creationTime: calcTime(new Date()), attachments: reply.newAttachments, editingReply: asDraft };
        reply.postingReply = true;
        ticketReplyFactory.addReply($scope.ticket.id, reply.id, newCommentReply).success(function (data, status) {
            if (reply.comments.length > 0) {
                reply.comments[reply.comments.length - 1].needsAttention = false;
            }
            newCommentReply.id = data;
            reply.comments.push(newCommentReply);

            reply.newComment = "";
            reply.newAttachments = [];
            $scope.ticket.messageCount++;
            //Enumerable.From($scope.$parent.tickets).Where('t=>t.id==' + $scope.ticket.id).FirstOrDefault().messageCount = $scope.ticket.messageCount;
            reply.showReplyInput = false || asDraft;

            if (!asDraft) {
                $scope.ticket.isAttentionNeeded = false;
            }
            reply.postingReply = false;
            if (isArchive) {
                $scope.ticket.isLocked = false;
                $scope.ticket.lockedBy = null;
            }
        });





    };



    $scope.addReply = function (asDraft, isArchive, replyId) {
        if (!asDraft) {
            $scope.ticket.messageCount++;
            $scope.ticket.isAttentionNeeded = false;
        }
        $scope.ticket.isArchived = $scope.ticket.isAutoArchive = isArchive;
        var newReply = { isFromStaff: true, justPosted: true, twitterAccount: $scope.twitterAccount, isDraft: asDraft, user: user.profile(), message: $scope.newReply, creationTime: calcTime(new Date()), comments: [], attachments: $scope.newAttachments, editingReply: asDraft };
        $scope.postingReply = true;
        ticketReplyFactory.addReply($scope.ticket.id, null, newReply).success(function (data, status) {
            // turn needs attentiuon off for latest reply 
            var latestReply = Enumerable.From($scope.ticket.replies).Where('t=>t.id==' + $scope.latestId).FirstOrDefault();
            if (latestReply != null) {
                latestReply.needsAttention = false;
                if (latestReply.comments.length > 0) {
                    latestReply.comments[latestReply.comments.length - 1].needsAttention = false;
                }
            }

            if ($scope.ticket.replies.length > 0) {
                $scope.ticket.replies[$scope.ticket.replies.length - 1].needsAttention = false;
            }
            $scope.latestId = newReply.id = data;
            $scope.ticket.replies.push(newReply);

            $scope.newReply = "";
            initTicketReplyUser();
            $scope.newAttachments = [];
            $scope.postingReply = false;
            if (isArchive) {
                $scope.ticket.isLocked = false;
                $scope.ticket.lockedBy = null;
            }


        });


    };

    $scope.deleteReply = function (reply) {
        ticketReplyFactory.deleteReply($scope.ticket.id, null, reply.id).success(function (data, status) {
            $scope.ticket.replies.splice($scope.ticket.replies.indexOf(reply), 1);
        });
    };

    $scope.deleteComment = function (reply, comment) {
        ticketReplyFactory.deleteReply($scope.ticket.id, reply.id, comment.id).success(function (data, status) {
            reply.comments.splice(reply.comments.indexOf(comment), 1);
            Enumerable.From($scope.$parent.tickets).Where('t=>t.id==' + $scope.ticket.id).FirstOrDefault().messageCount = $scope.ticket.messageCount;
        });
    };

    $scope.doneEditing = function (parentReplyId, replyOrSubReply) {
        ticketReplyFactory.updateReply($scope.ticket.id, parentReplyId, replyOrSubReply).success(function (data, status) { });
    };

    $scope.doneEditingComment = function () {
        ticketSaveFactory.comments($scope.ticket.comments, $scope.ticket.id);
    };

    $scope.getSignature = function () {
        if ($state.current.name == 'onetime' || $scope.ticket.properties == null) {
            return "";
        }
        function signature(item) {
            return item.isActive ? item.text : '';
        }
        if ($scope.ticket == null) return;
        var br = "<br/>";

        switch ($scope.ticket.source) {
            case eSource.facebook:
                return '\n' + signature(user.profile().signatures.faceBook);
            case eSource.twitter:
                return '\n' + ($scope.ticket.properties.isPublic ? signature(user.profile().signatures.twitter) : signature(user.profile().signatures.twitterMessage));
            default:
                return br + ($scope.ticket.properties.isPublic ? signature(user.profile().signatures.public) : signature(user.profile().signatures.private));
        }
    };



    $scope.reload = function () {
        $scope.refreshTicketPromt = false;
        $scope.refreshTicketPromtForThread = false;
        $scope.clearWatchers();
        $scope.refreshing = true;
        $rootScope.reloading = true;
        $scope.updatingTicket = true;
        ticketFactory().get({ ticketId: $stateParams.ticketId }, function (ticket) {
            $rootScope.ticket = $scope.ticket = ticket;
            $scope.refreshing = false;
            setTimeout(function () { $rootScope.reloading = false; }, 200);
            $scope.addWatchers();
            // update the same ticket in the feed
            copyPropsToListTicket();
            $scope.updatingTicket = false;
            $scope.unAnsweredCount = $scope.getUnAnsweredCount();
        });
    };

    $scope.$on('event:refreshTicketPromt', function (event, args) {
        $scope.refreshTicketPromt = true;
    });

    $scope.$on('event:refreshTicketPromtForThread', function (event, args) {
        $scope.refreshTicketPromtForThread = true;
    });

    $scope.$on('event:reloadTicket', function (event, args) {
        $scope.reload();
    });

    $scope.refreshKloutInfo = function () {
        kloutFactory({ user: $scope.currentViewedUser, source: $scope.ticket.source }).get(function (info) {
            $scope.currentViewedUserInfoKlout = info;
        });
    };

    $scope.showUserInfo = function (user) {
        var userPhoto = { url: user.image || 'http://www.etceter.com/assets/43b442c6/no_avatar_available.jpg' };
        $scope.currentViewedUserInfoKlout = { photos: [userPhoto] };
        $scope.currentViewedUser = user;
        $scope.linkToOldUser = function () {
            return appConfig.oldUrl + '/' + $stateParams.community + '/people/' + (user.oldLink || 'notImplemented');
        }

        kloutFactory({ user: user, source: $scope.ticket.source }).get(function (info) {
            if (info.status != 202) {
                $scope.currentViewedUserInfoKlout = info;
                if ($scope.currentViewedUserInfoKlout.photos == null || $scope.currentViewedUserInfoKlout.photos.length == 0) {
                    $scope.currentViewedUserInfoKlout.photos = [];
                }
                $scope.currentViewedUserInfoKlout.photos.push(userPhoto);
            } else {
                setTimeout(function () {
                    kloutFactory({ user: user, source: $scope.ticket.source }).get(function (info) {
                        if (info.status != 202) {
                            $scope.currentViewedUserInfoKlout = info;
                            if ($scope.currentViewedUserInfoKlout.photos == null || $scope.currentViewedUserInfoKlout.photos.length == 0) {
                                $scope.currentViewedUserInfoKlout.photos = [];
                            }
                            $scope.currentViewedUserInfoKlout.photos.push(userPhoto);
                        } else {
                            setTimeout($scope.refreshKloutInfo(), 1500);
                        }

                    });
                }, 1500);
            }

        });

        $('#userInfoModal').modal();
    };

    $scope.isHtmlable = function () {
        if ($scope.ticket == null) {
            return false;
        }
        return $scope.ticket.source == 0 || $scope.ticket.source == 3;
    };

    $scope.chooseCategory = function () {
        $scope.shared.my_tree_handler = function (branch) {
            $scope.shared.selectedBranch = branch;
        };
        $scope.shared.chooseCategoryDone = function () {
            if ($scope.shared.selectedBranch == null) return;
            $scope.ticket.category = { label: $scope.shared.selectedBranch.label, id: $scope.shared.selectedBranch.id };
            $scope.shared.selectedBranch.selected = false;
            $scope.categoryInProgress = true;
            ticketSaveFactory.save($scope.ticket, $scope.ticket.id).success(function (data, status) {
                $scope.categoryInProgress = false;
            });
        };
    };

    $scope.lockTicket = function (ticket) {
        if ($scope.ticket.isArchived || $scope.ticket.properties.isTrash) {
            alert('The ticket is archived or deleted. Please restore it before you change its properties');
            return 0;
        }

        if (user.profile().isAdmin == false && ticket.lockedBy != null && user.profile().id != ticket.lockedBy.id) {
            alert('You cannot unlock a ticket locked by another user');
        } else {
            $scope.lockInProgress = true;
            ticketSaveFactory.lockTicket($scope.ticket.id, !ticket.isLocked).success(function (data, status) {
                ticket.isLocked = !ticket.isLocked;
                $scope.ticket.lockedBy = ticket.isLocked ? user.profile() : null;
                copyPropsToListTicket();
                $scope.lockInProgress = false;
            });
        }
    };


    $scope.locked = function () {
        if ($scope.ticket == null || $scope.ticket.properties == null || $scope.isOneTime()) {
            return false;
        } else {
            return ($scope.ticket.isLocked && ($scope.ticket.lockedBy == null || $scope.ticket.lockedBy.id != user.profile().id));
        }
    };

    $scope.logLink = function () {
        return $scope.ticket == null ? '' : appConfig.oldUrl + '/' + $stateParams.community + '/admin/individualmsglogs/FeedBackId=' + $scope.ticket.id;
    };

    $scope.selectFiles = function (reply) {
        var modalInstance = $modal.open({
            templateUrl: 'app/partials/ticket/detail/selectFiles.cshtml',
            controller: 'selectFilesCtrl',
            resolve: {
                multiFiles: function () {
                    return !$scope.fb();
                }
            }
        });

        modalInstance.result.then(function (files) {
            console.log(files);
            if (reply == null) {
                $scope.newAttachments = $scope.ticket.source == eSource.facebook ? files : $scope.newAttachments.concat(files);
            } else {
                reply.newAttachments = reply.newAttachments == null || $scope.ticket.source == eSource.facebook ? files : reply.newAttachments.concat(files);
            }

        }, function () { });
    };

    $scope.removeAttachment = function (attachments, reply) {
        attachments.splice(attachments.indexOf(reply), 1);
    };

    $scope.fastReply = function () {
        var mydiv = $('#ticketDetail');
        mydiv.scrollTop(mydiv.prop('scrollHeight'));
    };

    $scope.showLikes = function (obj, objType, objId) {
        obj.showLikes = !obj.showLikes;

        likeFactory({ type: objType, id: objId }).get().$promise.then(function (data) {
            console.log(data);
            obj.likeCount = data.likeCount;
            obj.isLiked = data.isLiked;
        });
    };

    $scope.toggleLike = function (obj, objType, objId) {
        if (!$scope.ticket.isEditable) {
            return 0;
        }
        obj.isLiked = !obj.isLiked;
        obj.likeCount = obj.likeCount + (obj.isLiked ? 1 : -1);

        likeChangeFactory({ type: objType, id: objId, likedStatus: obj.isLiked }).toggle();
    };

    $scope.skip = 0;
    $scope.count = 5;
    $scope.ticketLog = [];
    $scope.loadLog = function () {
        $scope.loadedLog = false;
        logFactory().query({ ticketId: $stateParams.ticketId, skip: $scope.skip, take: $scope.count, userId: '' }, function (log) {
            $scope.ticketLog = $scope.skip == 0 ? log : $scope.ticketLog.concat(log);
            $scope.loadedLog = true;
            $scope.allLogLoaded = log.length == 0;
        });
    };

    $scope.loadMoreLog = function () {
        $scope.skip += $scope.count;
        $scope.loadLog();
    };
}]);

appControllers.controller('selectUsersCtrl', ['$scope', '$modalInstance', 'userFactory', 'title', 'okBtnTitle', 'comment', 'assignedUsers',
function ($scope, $modalInstance, userFactory, title, okBtnTitle, comment, assignedUsers) {
    $scope.users = [];
    $scope.title = title;
    $scope.okBtnTitle = okBtnTitle;
    $scope.comment = comment;
    $scope.assignedUsers = assignedUsers;
    $scope.loading = true;
    userFactory("").query(function (users) {
        angular.forEach(users, function (value, key) {
            if (Enumerable.From($scope.assignedUsers).Any('t=>t.email==' + '"' + value.email + '"')) {
                users.splice(users.indexOf(value), 1);
            }
        });
        $scope.users = users;
        $scope.loading = false;
    });

    $scope.ok = function () {
        $modalInstance.close({ users: $scope.$$childTail.$$childTail.selectedItems, message: $scope.$$childTail.comment });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.addNewUser = function () {
        $scope.$$childTail.$$childTail.selectedItems.push({ name: $scope.$$childTail.name, email: $scope.$$childTail.email });
        $scope.$$childTail.name = '';
        $scope.$$childTail.email = '';
        $scope.showForm = false;
    };
}]);

appControllers.controller('selectFilesCtrl', ['$scope', '$modalInstance', '$fileUploader', 'multiFiles', 'appConfig',
function ($scope, $modalInstance, $fileUploader, multiFiles, appConfig) {
    $scope.attachments = [];
    $scope.multiFiles = multiFiles;
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.close = function () {
        $modalInstance.close($scope.attachments);
    };
    // create a uploader with options
    var uploader = $scope.uploader = $fileUploader.create({
        scope: $scope,                          // to automatically update the html. Default: $rootScope
        url: appConfig.apiUrl + '/files',
        formData: [
            { key: 'value' }
        ]
    });

    $scope.removeFile = function (file) {
        uploader.queue.splice(uploader.queue.indexOf(file), 1);
    };

    // replace uploader by response. Response should be array of links to uploaded files
    uploader.bind('complete', function (event, xhr, item, response) {
        $scope.attachments.push(response.fileUrl);
    });
}]);