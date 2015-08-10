/* jslint node: true */

'use strict';

var config = require(__dirname + '/../config/config'),
    API_BASE_URL = config.YOUTUBE.API_BASE_URL,
    API_KEY = config.YOUTUBE.API_KEY,
    google_auth_url = 'https://accounts.google.com/o/oauth2/token',
    util = require(__dirname + '/../helpers/util'),
    superagent = require('superagent'),
    _ = require('lodash'),
    moment = require('moment'),
    cuddle = require('cuddle');

exports.get_channel_comments = function (req, res, next) {
    var params = util.get_data(['channel_id'], ['next_page_token', 'last_saved'], req.query),
        query = {
            part: 'snippet',
            textFormat: 'plainText',
            key: API_KEY,
            maxResults: 100,
            order: 'time',
            allThreadsRelatedToChannelId: params.channel_id,
        },
        comments = [],

        start = function () {
            params.last_saved = params.last_saved || moment();
            superagent.get(API_BASE_URL + '/commentThreads')
                .query(query)
                .send()
                .end(send_response);
        },

        send_response = function (err, result) {
            if (err) {
                return res.send(err);
            }

            comments = _.filter(result.body.items, function (item, key) {
                return moment(item.snippet.topLevelComment.snippet.updatedAt).diff(moment(params.last_saved)) > 0;
            });

            return res.send(comments);
        };

    start();
};

exports.get_comment_threads = function (req, res, next) {
    var params = util.get_data(['video_id'], ['next_page_token'], req.query),
        query = {
            part: 'snippet',
            textFormat: 'plainText',
            key: API_KEY,
            videoId: params.video_id,
            pageToken: (params.next_page_token || '')
        },

        start = function () {
            superagent.get(API_BASE_URL + '/commentThreads')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .query(query)
                .send()
                .end(send_response);
        },

        send_response = function (err, result) {
            if (err) {
                return res.send(err);
            }

            return res.send(result.body);
        };

    start();
};

exports.get_comments = function (req, res, next) {
    var params = util.get_data(['video_id', 'channel_id', 'parent_id'], [], req.query),
        query = {
            part: 'snippet',
            textFormat: 'plainText',
            key: API_KEY,
            videoId: params.video_id,
            channelId: params.channel_id,
            parentId: params.parent_id,
        },
        data = {},
        comments = [],
        comment_body,

        start = function () {
            superagent.get(API_BASE_URL + '/comments')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .query(query)
                .send()
                .end(send_response);
        },

        send_response = function (err, result) {
            if (err) {
                return res.send({ err: err });
            }

            _(result.body.items).forEach(function (comment) {
                comment_body = comment.snippet;
                comments.push({
                    username: comment_body.authorDisplayName,
                    comment: comment_body.textDisplay,
                    display_date: moment(comment_body.publishedAt).fromNow(),
                    username_link: comment_body.authorChannelUrl,
                    avatar: comment_body.authorProfileImageUrl,
                });
            }).commit();

            res.send(comments);
        };

    start();
};

exports.post_comment_thread = function (req, res, next) {
    var params = util.get_data([
                'video_id',
                'channel_id',
                'comment_text',
                'access_token'
            ],
            [],
            req.query
        ),
        data = {
            snippet: {
                videoId: params.video_id,
                channelId: params.channel_id,
                topLevelComment: {
                    snippet: {
                        textOriginal: params.comment_text
                    }
                }
            }
        },
        response = {
            endpoint: 'insert comment thread'
        },

        start = function () {
            superagent.post(API_BASE_URL + '/commentThreads')
                .set('Authorization', 'Bearer ' + params.access_token)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .query({
                    part: 'snippet',
                    shareOnGooglePlus: false,
                    alt: 'json',
                })
                .send(data)
                .end(send_response);
        },

        send_response = function (err, result) {
            if (err) {
                response.error = err;
            }

            res.send(response);
        };

    start();
};

exports.post_comment = function (req, res, next) {
    var params = util.get_data(['parent_id', 'comment_text', 'access_token'], [], req.query),
        data = {
            snippet:{
                parentId: params.parent_id,
                textOriginal: params.comment_text
            }
        },
        response = {
            endpoint: 'insert comment'
        },

        start = function () {
            superagent.post(API_BASE_URL + '/comments')
                .set('Authorization', 'Bearer ' + params.access_token)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .query({
                    part: 'snippet',
                    shareOnGooglePlus: false,
                    alt: 'json',
                })
                .send(data)
                .end(send_response);
        },

        send_response = function (err, result) {
            if (err) {
                response.error = err;
            }

            res.send(response);
        };

    start();
};

exports.chat_callback = function (req, res, next) {
    var data = {
            grant_type: 'authorization_code',
            client_id: config.YOUTUBE.client_id,
            client_secret: config.YOUTUBE.client_secret,
            redirect_uri: config.YOUTUBE.chat_redirect_uri
        },
        //state = JSON.parse(req.query.state),

        start = function () {
            if (!req.query.code) {
                return res.send({'error':'Access Denied.'});
            }

            data.code = req.query.code;

            cuddle.post
                .to(google_auth_url)
                .send(data)
                .then(get_tokens);
        },

        get_tokens = function (err, result) {
            if (err) {
                return next(err);
            }

            if (!result) {
                return next('Error on authorization.');
            }

            req.session.youtube_chat = result;

            cuddle.get
                .to('https://www.googleapis.com/youtube/v3/channels')
                .send({
                    part: 'snippet',
                    mine: true,
                    access_token: result.access_token
                })
                .then(redirect);
        },

        redirect = function (err, result) {
            if (err) {
                return next(err);
            }

            req.session.youtube_user = result;

            res.send({message:'ok'});
        };

    start();
};
