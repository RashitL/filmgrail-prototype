'use strict';

/* Services */

app.value('$', $);
//jQuery.support.cors = true;
appServices.factory('signalRSvc', function ($, $rootScope, appConfig) {
    return {
        proxy: null,
        initialize: function (updatedTicketCallback) {
            //Getting the connection object
            var connection = $.hubConnection(appConfig.apiUrlBase);
            connection.logging = true;
            //Creating proxy
            this.proxy = connection.createHubProxy('ticketHub');

            //Starting connection
            connection.start({
                jsonp: true
            });

            console.log(connection);

            //Attaching a callback to handle updatedTicketCallback client call
            this.proxy.on('updatedTicket', function (ticketId, userId, folderCountChanged, communityName, props, users, isArchived, isAttentionNeeded, lockedBy, messageCount, folderStat) {
                $rootScope.$apply(function () {
                    updatedTicketCallback(ticketId, userId, folderCountChanged, communityName, props, users, isArchived, isAttentionNeeded, lockedBy, messageCount, folderStat);
                });
            });
        }
    }
});

// signal r
appServices.run(function ($rootScope, user, appConfig, $state, $stateParams, signalRSvc, ticketFactory) {
    var updateTicketMessage = function (ticketId, userId, folderCountChanged, communityName, props, users, isArchived, isAttentionNeeded, lockedBy, messageCount, folderStat) {
        // check if the update was in current community
        if (communityName != $stateParams.community) {
            return 0;
        }



        // if only folder count has changed we reload folders and tickets in the feed in case there is a new ticket in a folder or it was deleted and return
        if (folderCountChanged) {
            if ($rootScope.showAllTickets && user.profile().isAdmin) {
                $rootScope.folderStat = folderStat;
                Tinycon.setBubble(folderStat.attentionNeeded);
            }
            $rootScope.$broadcast('event:refreshPromt');
            return 0;
        }

        var showUpdateTicketPrompt = false;
        var showUpdateTicketPromptThreadChange = false;
        // update ticket props for current ticket
        if ($rootScope.ticket.isAttentionNeeded != null && userId != user.profile().id && ticketId == $rootScope.ticket.id) {
            showUpdateTicketPrompt = ($rootScope.ticket.isAttentionNeeded == isAttentionNeeded && $rootScope.ticket.isLocked == (lockedBy != null)) || ($rootScope.ticket.messageCount != messageCount);
            showUpdateTicketPromptThreadChange = $rootScope.ticket.messageCount != messageCount;

            $rootScope.ticket.isAttentionNeeded = isAttentionNeeded;
            if (!$rootScope.ticket.isLocked && lockedBy != null) {
                alert(lockedBy.name + ' has locked this ticket! You cannot do any actions on this ticket while it is locked by another user unless you are an admin!');
            }
            $rootScope.ticket.isLocked = lockedBy != null;
            $rootScope.ticket.lockedBy = lockedBy;
            $rootScope.ticket.messageCount = messageCount;
        }

        // update props for list ticket
        angular.forEach($rootScope.tickets, function (value, key) {
            if (value.id == ticketId) {
                value.isAttentionNeeded = isAttentionNeeded;
                value.isLocked = lockedBy != null;
                // save draft status to nbot be overrided
                var oldProps = value.properties;
                value.properties = props;
                // restore draft status
                value.properties.isDraft = oldProps.isDraft;
                value.properties.isFbSb = oldProps.isFbSb;
                value.messageCount = messageCount;
            }
        });

        // if we came here means that there was a change in a specific ticket
        // if the ticketId is the same as the one we are viewing on the right panel then we reload this ticket
        if ($rootScope.ticket != null && ticketId == $rootScope.ticket.id && showUpdateTicketPrompt) {
            // we make sure the ticket in the feed is updated as well when this event if fired!!!
            //$rootScope.$broadcast('event:reloadTicket');
            if (userId != user.profile().id)
                if (showUpdateTicketPromptThreadChange) {
                    $rootScope.$broadcast('event:refreshTicketPromtForThread');
                }
                else {
                    $rootScope.$broadcast('event:refreshTicketPromt');
                }

        } else {
            $rootScope.$broadcast('event:refreshPromt');

            //// if there is a ticket update and it is not a current ticket then we load it anyway and update the ticket in a feed
            //var ticketInFeed = Enumerable.From($rootScope.tickets).Where('t=>t.id==' + ticketId).FirstOrDefault();
            //// we check that the ticket is visible currently in a feed
            //if (ticketInFeed != null) {
            //    // load the ticket from server to set to the feed
            //    ticketFactory().get({ ticketId: ticketId }, function(ticket) {
            //        ticketInFeed = ticket;
            //    });
            //}
        }
    };

    signalRSvc.initialize(updateTicketMessage);
});