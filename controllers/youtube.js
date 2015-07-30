/* jslint node: true */

'use strict';

var config = require(__dirname + '/../config/config'),
    API_BASE_URL = config.YOUTUBE.API_BASE_URL,
    API_KEY = config.YOUTUBE.API_KEY,
    util = require(__dirname + '/../helpers/util'),
    superagent = require('superagent'),
    yt_access_token = 'ya29.vwED5fFs7kPfx04JpkTWwUnfIwIT5yI0jS_qmdhq8o4Qst81YgoVP4WErJGX9C3FA2dPc2Zhvj4';
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
