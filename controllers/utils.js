/* jslint node: true */

'use strict';

var config = require(__dirname + '/../config/config'),
    util = require(__dirname + '/../helpers/util'),
    cuddle = require('cuddle');

exports.get_current_session = function (req, res, next) {
    var start = function () {
            res.send({session:req.session});
        };

    start();
};

exports.get_token_validity = function (req, res, next) {
    var data = util.get_data([], ['access_token'], req.query),
        response = {
            access_token: data.access_token || ''
        },

        start = function () {
            cuddle.post
                .to('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + data.access_token)
                .send()
                .then(send_response);
        },

    send_response = function (err, result) {
        if (err) {
            result = {};
        }

        response.expires_in = result && result.expires_in || 0;
        response.is_valid = !!result.expires_in;
        res.send(response);
    };

    start();
};
