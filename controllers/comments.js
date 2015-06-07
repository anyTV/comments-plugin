'use strict';

var config = require(__dirname + '/../config/config'),
    util = require(__dirname + '/../helpers/util'),
    mysql = require('anytv-node-mysql'),
    MD5 = require('MD5'),
    _ = require('lodash'),
    moment = require('moment'),
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
        data = util.get_data(['token', 'username', 'type', 'email', 'comment'], [], req.body),
        
        start = function () {
            if (typeof data === 'string' || typeof reqs === 'string') {
                return next(data || reqs);
            }

            User.get_user_by_token(data.token, validate_user);
        },

        validate_user = function (err, user) {
            var comment_data = {};

            if (err) {
                return next(err);
            }

            if (user.email !== data.email) {
                return next('Invalid credentials');
            }

            comment_data.email = user.email;
            comment_data.topic = reqs.topic_id;
            comment_data.comment = data.comment;
            comment_data.type = data.type;
            comment_data.username = data.username;

            Comment.create_comment(comment_data, send_response);
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
            if (err) {
                user.token && delete user.get_user_by_token;
                user.username && delete user.username;
                user.email && delete user.email;
            }

            Comment.get_comments(data.topic_id, data.type, 1, get_total);
        },

        get_total = function (err, result) {
            if (err) {
                return next(err);
            }

            comments = result;

            Comment.get_total(data.topic_id, data.type, send_response);
        },

        send_response = function (err, result) {
            var to_render = user;
            
            to_render.topic = data.topic_id;
            
            if (err) {
                return next(err);
            }

            _(comments).forEach(function (comment) {
                comment.avatar = 'http://www.gravatar.com/avatar/' + (MD5(comment.email.trim()));
                comment.display_date = moment(comment.date_created).fromNow();
                comment.username_link = 'http://www.gravatar.com/' + (MD5(comment.email.trim()));

            }).commit();

            if (!user.email) {
                user.email = "empty";
            }

            to_render.comments = comments;
            to_render.total = result;
            to_render.avatar = 'http://www.gravatar.com/avatar/' + (MD5(user.email.trim()));
            
            res.render('comments', to_render);
        };

    start();
};

