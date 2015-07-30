/* jslint node: true */

'use strict';

var config = require(__dirname + '/../config/config'),
    API_BASE_URL = config.YOUTUBE.API_BASE_URL,
    API_KEY = config.YOUTUBE.API_KEY,
    google_auth_url = 'https://accounts.google.com/o/oauth2/token',
    util = require(__dirname + '/../helpers/util'),
    superagent = require('superagent'),
    cuddle = require('cuddle'),
    yt_access_token = 'ya29.wAEe41MpDE1hqNqXqPxuxuVJISFJLwNysfVjvoSq38Fju99uMVa_IPpSFi4qMSqleQDpxj4bHW8';
    //req.session.youtube_chat.access_token

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
            console.log(query);
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
                console.log(err);
            }

            res.send(result.body);
        };

    start();
};

exports.post_comment_thread = function (req, res, next) {
    var params = util.get_data(['video_id', 'channel_id', 'comment_text'], [], req.query),
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
            // if (!req.session || !req.session.youtube_chat) {
            //     response.error = 'Not logged in';
            //     return send_response(null, response);
            // }

            superagent.post(API_BASE_URL + '/commentThreads')
                .set('Authorization', 'Bearer ' + yt_access_token)
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
    var params = util.get_data(['parent_id', 'comment_text'], [], req.query),
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
            // if (!req.session || !req.session.youtube_chat) {
            //     response.error = 'Not logged in';
            //     return send_response(null, response);
            // }

            superagent.post(API_BASE_URL + '/comments')
                .set('Authorization', 'Bearer ' + yt_access_token)
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

            //store access token on session
            //req.session.youtube_chat = result;
            console.log('access_token', result);

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

            //store access token on session
            //req.session.youtube_user = result;
            console.log('user', result);

            res.send({message:'ok'});
        };

    start();
};
