'use strict';

var config = require(__dirname + '/../config/config'),
    util = require(__dirname + '/../helpers/util'),
    logger = require('anytv-node-logger'),
    mysql = require('anytv-node-mysql'),
    request = require('superagent'),
    squel = require('squel'),
    moment = require('moment'),
    Youtube = require(__dirname + '/youtube');

exports.create_comment = function (comment_data, next) {
    var data = {},

        start = function () {
            comment_data.date_created = moment().format('YYYY-MM-DD HH:mm:ss');
            mysql.open(config.DB)
                .query('INSERT INTO comments SET ?', comment_data, send_response)
                .end();
        },

        send_response = function (err, result) {
            if (err) {
                return next(err);
            }

            if (!result.affectedRows) {
                return next('Error in posting comment');
            }

            next(null, 'Comment posted');
        };

    start();
};

exports.get_comments = function (topic, type, page, next) {
    var data = {},

        start = function () {
            var where_clause = ' where topic = ? and type = ?',
                where_params = [topic, type],
                offset = 0;
            
            if (type == 'gamers_video') {
                return Youtube.get_comments(topic, page, next);
            }

            if (page && typeof page !== 'function') {
                offset = (page-1) * 5;
            }

            next = next || page;

            mysql.open(config.DB)
                .query('SELECT * from comments' + where_clause + ' order by date_created DESC LIMIT 5 OFFSET ' + offset,
                        where_params,
                        send_response)
                .end();
        },

        send_response = function (err, result) {
            if (err) {
                return next(err);
            }

            next(null, result);
        };

    start();
};

exports.get_total = function (topic, type, next) {
    var data = {},

        start = function () {
            var where_clause = ' where topic = ? and type = ?',
                where_params = [topic, type],
                offset = 0;

            if (type === 'gamers_video') {
                return Youtube.get_total(topic, send_response);
            }

            mysql.open(config.DB)
                .query('SELECT count(*) as total from comments' + where_clause + ' order by date_created DESC',
                        where_params,
                        send_response)
                .end();
        },

        send_response = function (err, result) {
            if (err) {
                return next(err);
            }

            next(null, result[0].total);
        };

    start();
};

