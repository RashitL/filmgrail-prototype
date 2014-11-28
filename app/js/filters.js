angular.module('app.filters', ['ngSanitize']).filter('limitString', function () {
    return function (str) {
        var lengthLimit = 10;
        return str.length > lengthLimit ? str.substr(0, lengthLimit) + '...' : str;
    };
}).filter('nullIfZero', function () {
    return function (number) {
        return number == 0 ? "" : number;
    };
}).filter('lastComment', function () {
    return function (comments, show, hasNew) {
        if (comments == null || comments.length == 0) return [];
        if (comments.length == 1) return comments;

        var skip = hasNew ? 2 : 1;
        var lessComments = Enumerable.From(comments).Skip(comments.length - skip).ToArray();
        return show ? comments : lessComments;
    };
}).filter('pagingForReplies', function () {
    return function (comments, take, showUnAnsweredReplies, latestId, threadCollapsed) {
        if (threadCollapsed && latestId != null) {
             return [Enumerable.From(comments).Where('t=>t.id==' + latestId).FirstOrDefault()];
        }
        // if less than 3 replies we just show it all
        if (comments == null || comments.length < 3) return comments;
        // if no replies we return empty array
        if (take == 0 && !showUnAnsweredReplies && comments.length == 0) return [];
        // if user clicked "show unanswered replies"
        if (showUnAnsweredReplies) {
            var result = [];
            angular.forEach(comments, function (value, key) {
                if (value.comments.length > 0) {
                    var comment = Enumerable.From(value.comments).LastOrDefault();
                    if (!comment.isFromStaff) {
                        value.showBold = true;
                        result.push(value);
                    }
                }
            });

            return result;
        }

        // if less that 10 replies than we dont need paging
        if (comments.length < 10) return comments;
        // run paging for more than 10 replies
        return Enumerable.From(comments).TakeFromLast(take).ToArray();
    };
}).filter('capitalize', function () {
    return function (input) {
        if (input.length == 0) {
            return "";
        }
        if (input != null)
            input = input.toLowerCase();
        return input.substring(0, 1).toUpperCase() + input.substring(1);
    };
}).filter('cutCategoryId', function () {
    return function (categoryLabel) {
        if (categoryLabel == null || categoryLabel.length == 0) {
            return categoryLabel;
        }
        return categoryLabel.split("--")[0];
    };
}).filter('truncate', function () {
    return function (text, length, end) {
        if (isNaN(length))
            length = 10;

        if (end === undefined)
            end = "...";

        if (text.length <= length || text.length - end.length <= length) {
            return text;
        }
        else {
            return String(text).substring(0, length - end.length) + end;
        }

    };
}).filter('striphtml', function () {
    return function (html) {
        //return text.replace(/<\/?[^>]+(>|$)/g, "");
        var tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return (tmp.textContent || tmp.innerText || "").replace(/<\/?[^>]+(>|$)/g, "");
    };
}).filter('onlyimages', function () {
    return function (attachments) {
        return Enumerable.From(attachments).Where("t=>t.indexOf('.jpg')>0||t.indexOf('.jpeg')>0||t.indexOf('.png')>0||t.indexOf('.Jpeg')>0||t.indexOf('.PNG')>0||t.indexOf('.JPG')>0").ToArray();
    };
}).filter("timeago", function () {
    //time: the time
    //local: compared to what time? default: now
    //raw: wheter you want in a format of "5 minutes ago", or "5 minutes"
    return function (time, local, raw) {
        if (!time) return "timestamp is not avaiable";
        if (!local) {
            (local = Date.now());
            var now = new Date;
            local = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
      now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
        }

        if (angular.isDate(time)) {
            time = new Date(time + 'Z');
            time.setHours(time.getHours() - 1);
            time = time.getTime();
        } else if (typeof time === "string") {
            time = new Date(time + 'Z');
            time.setHours(time.getHours() - 1);
            time = time.getTime();
        }

        if (angular.isDate(local)) {
            local = local.getTime();
        } else if (typeof local === "string") {
            local = new Date(local).getTime();
        }

        if (typeof time !== 'number' || typeof local !== 'number') {
            return;
        }

        var
            offset = Math.abs((local - time) / 1000),
            span = [],
            MINUTE = 60,
            HOUR = 3600,
            DAY = 86400,
            WEEK = 604800,
            MONTH = 2629744,
            YEAR = 31556926,
            DECADE = 315569260;

        if (offset <= MINUTE) span = ['', raw ? 'now' : 'less than a minute'];
        else if (offset < (MINUTE * 60)) span = [Math.round(Math.abs(offset / MINUTE)), 'min'];
        else if (offset < (HOUR * 24)) span = [Math.round(Math.abs(offset / HOUR)), 'hr'];
        else if (offset < (DAY * 7)) span = [Math.round(Math.abs(offset / DAY)), 'day'];
        else if (offset < (WEEK * 52)) span = [Math.round(Math.abs(offset / WEEK)), 'week'];
        else if (offset < (YEAR * 10)) span = [Math.round(Math.abs(offset / YEAR)), 'year'];
        else if (offset < (DECADE * 100)) span = [Math.round(Math.abs(offset / DECADE)), 'decade'];
        else span = ['', 'just now'];

        span[1] += (span[0] === 0 || span[0] > 1) ? 's' : '';
        span = span.join(' ');

        if (raw === true) {
            return span;
        }
        return (time <= local) ? span + ' ago' : '' + span;
    }
});

