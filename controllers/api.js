/* jslint node: true */

'use strict';

var config = require(__dirname + '/../config/config'),
    util = require(__dirname + '/../helpers/util'),
    _ = require('lodash'),
    moment = require('moment'),
    superagent = require('superagent'),
    API_BASE_URL = config.YOUTUBE.API_BASE_URL,
    API_KEY = config.YOUTUBE.API_KEY;

exports.get_video_comments = function (req, res, next) {
    var params = util.get_data(['videoid'], ['next_page_token','count','offset'], req.query),
        query = {
            part: 'snippet',
            textFormat: 'plainText',
            key: API_KEY,
            videoId: params.videoid,
            maxResults: params.count ? params.count : 100,
            pageToken: (params.next_page_token || '')
        },
        comments = [],

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
                return res.send({
                    errcode: '-1',
                    errmsg: 'Server busy'
                });
            }

            _.forEach(result.body.items, function (item) {
                var snippet = item.snippet.topLevelComment.snippet;

                comments.push({
                    id: item.id,
                    title: snippet.textDisplay,
                    content: snippet.textDisplay,
                    data: {
                        avatar: snippet.authorProfileImageUrl,
                        date_posted: moment(snippet.publishedAt).fromNow(),
                        next_page_token: result.body.nextPageToken
                    },
                    username: snippet.authorDisplayName,
                    userid: snippet.authorChannelId.value,
                    videoid: snippet.videoId
                });
            });

            return res.send(comments);
        };

    start();
};
