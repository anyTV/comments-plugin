'use strict';

var path = require('path'),

    extend = function (obj, source) {
        var prop;

        for (prop in source) {
            if (source.hasOwnProperty(prop)) {
                obj[prop] = source[prop];
            }
        }

        return obj;
    },

    to_param = function (params) {
        return Object.keys(params)
            .map(function(param) {
                return encodeURIComponent(param) + '=' + encodeURIComponent(params[param]);
            })
            .join('&');
    },

    config = {
        APP_NAME: 'anyTV Node Boilerplate',

        PORT: 8082,

        CORS :  {
            allowed_headers : 'Access-Token, X-Requested-With, Content-Type, Accept',
            allowed_origins : '*',
            allowed_methods : 'GET, POST, PUT, OPTIONS, DELETE'
        },

        UPLOAD_DIR: path.normalize(__dirname + '/../uploads/'),
        VIEWS_DIR: path.normalize(__dirname + '/../views'),
        LOGS_DIR: path.normalize(__dirname + '/../logs/'),

        FACCOUNTS : {
            BASE_URL    : 'api.accounts.freedom.tm',
            PORT        : '80',
            LOGIN_URL   : 'login',
            AUTH_URL    : 'auth',
            auth        : function(params) {
                return this.BASE_URL + ':'
                    + this.PORT + '/'
                    + this.AUTH_URL
                    + (params ? '?' + to_param(params) : '');
            },
        },

        DB: {
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'anytv_comments'
        },

        GAMERS_DB: {
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'gamers_tm'
        }

    };


// set development as our default environment
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
}

module.exports = extend(config, require(__dirname + '/env/' + process.env.NODE_ENV));
