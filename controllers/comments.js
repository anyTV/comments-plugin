/* jslint node: true */

'use strict';

var config = require(__dirname + '/../config/config'),
    util = require(__dirname + '/../helpers/util'),
    mysql = require('anytv-node-mysql'),
    MD5 = require('MD5'),
    _ = require('lodash'),
    moment = require('moment'),
    cuddle = require('cuddle'),
    User = require(__dirname + '/../models/user'),
    Comment = require(__dirname + '/../models/comment');

exports.get_comments = function (req, res, next) {
    var data = util.get_data(['topic_id'], [], req.params),

        start = function () {
            if (typeof data === 'string') {
                return next(data);
            }

            data.page = 1;

            if (req.query && req.query.type && typeof req.query.type === 'string') {
                data.type = req.query.type;
            }

            if (req.query && req.query.page) {
                data.page = req.query.page;
            }

            Comment.get_comments(data.topic_id, data.type, data.page, send_response);
        },

        send_response = function (err, result) {
            if (err) {
                return next(err);
            }

            _(result).forEach(function (comment) {
                comment.avatar = 'http://www.gravatar.com/avatar/' + (MD5(comment.email.trim()));
                comment.display_date = moment(comment.date_created).fromNow();
                comment.username_link = 'http://www.gravatar.com/' + (MD5(comment.email.trim()));

            }).commit();

            res.send(result);
        };

    start();
};

exports.post_comments = function (req, res, next) {
    var reqs = util.get_data(['topic_id'], [], req.params),
        data = util.get_data(['token', 'username', 'type', 'email'], ['comment'], req.body),
        comment_data = {},

        start = function () {
            if (typeof data === 'string' || typeof reqs === 'string') {
                return next(data || reqs);
            }

            User.get_user_by_token(data.token, validate_user);
        },

        validate_user = function (err, user) {
            if (err) {
                return next(err);
            }

            if (user.email !== data.email) {
                return next('Invalid credentials');
            }

            data.comment = data.comment || '';

            comment_data.email = user.email;
            comment_data.topic = reqs.topic_id;
            comment_data.comment = data.comment;
            comment_data.type = data.type;
            comment_data.username = data.username;

            if (data.type === 'gamers_video') {
                return Comment.create_comment(comment_data, save_youtube_comment);
            }

            Comment.create_comment(comment_data, send_response);
        },

        save_youtube_comment = function (err, result) {
            if (err) {
                return next(err);
            }

            cuddle.get
                .to(config.APP_BASE_URL + '/youtube/insert_comment_thread' +
                    '?video_id=' + reqs.topic_id +
                    '&channel_id=' + 'UCztAApmLSyQmgJW9DhQ6gfw' +
                    '&comment_text=' + data.comment +
                    '&access_token=' +
                        (req.session && req.session.youtube_chat &&
                        req.session.youtube_chat.access_token) || 'empty'
                    )
                .send()
                .then(send_youtube_response);
        },

        send_youtube_response = function (err, result) {
            if (err) {
                return res.send({err: 'failed saving to youtube'});
            }

            send_response();
        },

        send_response = function (err, result) {
            if (err) {
                return next(err);
            }

            res.send(result);
        };

    start();
};

exports.get_comments_view = function (req, res, next) {
    var data = util.get_data(['topic_id'], [], req.params),
        user = util.get_data(['type'], ['token', 'email', 'username'], req.query),
        comment_body,
        comments = [],

        start = function () {
            if (typeof data === 'string') {
                return next(data);
            }

            if (typeof user === 'string') {
                return next(user);
            }

            if (req.query && req.query.type && typeof req.query.type === 'string') {
                data.type = req.query.type;
            }

            User.get_user_by_token(user.token || 'empty', get_comments);
        },

        get_comments = function (err, userdata) {
            var suppress;
            if (err) {
                suppress = user.token && delete user.get_user_by_token;
                suppress = user.username && delete user.username;
                suppress = user.email && delete user.email;
            }

            if (user.type === 'gamers_video') {
                cuddle.get
                    .to(config.APP_BASE_URL + '/youtube/get_comment_threads?video_id=' + data.topic_id)
                    .send()
                    .then(get_total_youtube);
                return;
            }

            Comment.get_comments(data.topic_id, data.type, 1, get_total);
        },

        get_total_youtube = function (err, result) {
            if (err) {
                return next(err);
            }

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
                });
            }).commit();

            send_response(null, result.items.length);
        },

        get_total = function (err, result) {
            if (err) {
                return next(err);
            }

            comments = result;

            _(comments).forEach(function (comment) {
                comment.avatar = 'http://www.gravatar.com/avatar/' + (MD5(comment.email.trim()));
                comment.display_date = moment(comment.date_created).fromNow();
                comment.username_link = 'http://www.gravatar.com/' + (MD5(comment.email.trim()));
            }).commit();

            Comment.get_total(data.topic_id, data.type, send_response);
        },

        send_response = function (err, result) {
            var to_render = user;

            to_render.topic = data.topic_id;

            if (err) {
                return next(err);
            }

            if (!user.email) {
                user.email = 'empty';
            }

            to_render.comments = comments;
            to_render.total = result;
            to_render.avatar = 'http://www.gravatar.com/avatar/' + (MD5(user.email.trim()));

            res.render('comments', to_render);
        };

    start();
};
