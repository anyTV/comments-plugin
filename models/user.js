'use strict'

var config = require(__dirname + '/../config/config'),
    util = require(__dirname + '/../helpers/util'),
    logger = require('anytv-node-logger'),
    mysql = require('anytv-node-mysql'),
    request = require('superagent'),
    squel = require('squel'),
    moment = require('moment');

exports.get_user_by_token = function (user_token, next) {
    var start = function () {
            request
                .get(config.FACCOUNTS.BASE_URL+':'+config.FACCOUNTS.PORT+'/user/')
                .set('Access-Token', user_token)
                .end(send_response);
        },

        send_response = function (err, result) {
            if (err) {
                return next(err);
            }

            next(null, result.body);
        };

    start();
};
