/* jslint node: true */

'use strict';

var config = require(__dirname + '/../config/config'),
    util = require(__dirname + '/../helpers/util'),
    mysql = require('anytv-node-mysql'),
    MD5 = require('MD5'),
    _ = require('lodash'),
    moment = require('moment'),
    cudl = require('cuddle'),
    User = require(__dirname + '/../models/user'),
    Comment = require(__dirname + '/../models/comment'),
    auth_params = {
        client_id: config.YOUTUBE.client_id,
        redirect_uri: config.YOUTUBE.chat_redirect_uri,
        scope: config.YOUTUBE.scopes.manage,
        response_type: 'code'
    };

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

            Comment.get_comments(data.topic_id, data.type, data.page, data.type=='gamers_video' ? format_data : send_response);
        },

        format_data = function (err, result) {
            if (err) {
                return next(err);
            }

            res.send(result);
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
        data = util.get_data(['token', 'username', 'type', 'email','user_id','channel_id'], ['comment', 'access_token'], req.body),
        comment_data = {},
        youtube_response,

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

            cudl.get
                .to(config.APP_BASE_URL + '/youtube/insert_comment_thread' +
                    '?video_id=' + reqs.topic_id +
                    '&channel_id=' + 'UCztAApmLSyQmgJW9DhQ6gfw' +
                    '&comment_text=' + data.comment +
                    '&access_token=' + data.access_token
                )
                .send()
                .then(send_youtube_response);
        },

        send_youtube_response = function (err, result) {
            if (err) {
                return res.send({err: 'failed saving to youtube'});
            }

            youtube_response = result.youtube_response;

            cudl.post
                .to(config.BACKEND_BASE_URL + '/api/notifications')
                .send({
                    user_id: data.user_id,
                    video_id: reqs.topic_id,
                    action: 'commented_video',
                    href: '/youtubers/' + data.user_id +
                        '/list/' + data.channel_id +
                        '/v/' + reqs.topic_id +
                        '/comment/comment_' + youtube_response.id,
                    read: 'false'
                })
                .then(send_response);
        },

        send_response = function (err, result) {
            if (err) {
                return next(err);
            }

            res.send(youtube_response);
        };

    start();
};

exports.get_comments_view = function (req, res, next) {
    var data = util.get_data(['topic_id'], [], req.params),
        user = util.get_data(
            [],
            [
                'type',
                'token',
                'email',
                'username',
                'channel_id',
                'user_id',
                'youtube_details',
                'avatar'
            ],
            req.query),
        comment_body,
        comments = [],
        state = {},
        youtube_options = {
            online: false
        },
        next_page_token = 2,
        avatar = user.avatar,
        to_render,

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

            Comment.get_comments(data.topic_id, user.type, 1, user.type === 'gamers_video' ? get_total_youtube : get_total);
        },

        get_total_youtube = function (err, result) {
            if (err) {
                return next(err);
            }

            comments = result.comments;
            next_page_token = result.next_page_token;

            state.username = user.username;
            state.type = user.type;
            state.topic_id = data.topic_id;
            state.token = user.token;
            state.redirect_uri = config.YOUTUBE.gamerstm_youtuber_page +
                user.user_id + '/list/' + user.channel_id + '/v/' + data.topic_id;
            auth_params.state = JSON.stringify(state);

            youtube_options.oauth_link = config.YOUTUBE.auth(auth_params);

            Comment.get_total(data.topic_id, data.type, send_response);
        },

        get_total = function (err, result) {
            if (err) {
                return next(err);
            }

            comments = result;

            _(comments).forEach(function (comment) {
                comment.avatar = 'http://www.gravatar.com/avatar/' +
                    (MD5(comment.email.trim()));
                comment.username_link = 'http://www.gravatar.com/' +
                    (MD5(comment.email.trim()));
                comment.display_date = moment(comment.date_created).fromNow();
            }).commit();

            Comment.get_total(data.topic_id, data.type, send_response);
        },

        send_response = function (err, result) {
            to_render = user;

            to_render.topic = data.topic_id;

            if (err) {
                return next(err);
            }

            if (!user.email) {
                user.email = 'empty';
            }

            to_render.comments = comments;
            to_render.next_page_token = next_page_token;

            to_render.avatar = (avatar !== 'undefined' && avatar) || '/assets/images/male80.svg';

            to_render.youtube_details = {};

            if (req.query.youtube_details && req.query.youtube_details !== 'undefined') {
                to_render.youtube_details = JSON.parse(req.query.youtube_details);
                youtube_options.online = true;
            }

            to_render.youtube_options = youtube_options;
            res.render('comments', to_render);
        };

    start();
};
