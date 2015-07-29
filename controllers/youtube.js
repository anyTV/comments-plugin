/* jslint node: true */

'use strict';

var config = require(__dirname + '/../config/config'),
    util = require(__dirname + '/../helpers/util');

exports.get_comment_threads = function (req, res, next) {
    var data = util.get_data(['video_id'], [], req.params),

        start = function () {
            send_response();
        },

        send_response = function (err, result) {

            res.send(data);
        };

    start();
};
