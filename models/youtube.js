'use strict';

var config = require(__dirname + '/../config/config'),
    util = require(__dirname + '/../helpers/util'),
    logger = require('anytv-node-logger'),
    mysql = require('anytv-node-mysql'),
    request = require('superagent'),
    squel = require('squel'),
    moment = require('moment'),
    _ = require('lodash');


exports.get_comments = function (video_id, token, next) {
    var query = {
            part: 'snippet',
            textFormat: 'plainText',
            key: config.YOUTUBE.API_KEY,
            videoId: video_id,
            pageToken: next && isNaN(token) ? token : null
        },

        comment_body = {},
        comments = [],

        start = function () {
            request.get(config.YOUTUBE.API_BASE_URL + '/commentThreads')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .query(query)
                .send()
                .end(format_data);
        },

        format_data = function (err, result) {
            if (err) {
                return next(err);
            }

            result = result.body;

             _(result.items).forEach(function (comment) {
                comment_body = comment.snippet.topLevelComment.snippet;
                comments.push({
                    email: 'empty',
                    type: 'gamers_video',
                    username: comment_body.authorDisplayName,
                    topic: comment_body.videoId,
                    comment: comment_body.textDisplay,
                    avatar: comment_body.authorProfileImageUrl,
                    display_date: moment(comment_body.publishedAt).fromNow(),
                    username_link: comment_body.authorChannelUrl,
                    reply_count: comment.snippet.totalReplyCount,
                    channel_id: comment.snippet.channelId,
                    comment_id: comment.id,
                    video_id: comment.snippet.videoId
                });
            }).commit();


            send_response(null, comments);
        },

        send_response = function (err, result) {
            if (err) {
                return next(err);
            }

            return next(null, result);
        };

    start();
};

exports.get_total = function (video_id, next) {
    var query = {
            part: 'snippet',
            textFormat: 'plainText',
            key: config.YOUTUBE.API_KEY,
            videoId: video_id,
        },

        comment_body = {},
        comments = [],

        start = function () {
            request.get(config.YOUTUBE.API_BASE_URL + '/commentThreads')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .query(query)
                .send()
                .end(send_response);
        },

        send_response = function (err, result) {
            if (err) {
                next(err);
            }

            next(null, [{total:result.body.pageInfo.totalResults || result.body.items.length}]);
        };

    start();
};
