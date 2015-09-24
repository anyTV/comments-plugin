'use strict';

var APP_BASE_URL = 'http://dev.gamers.tm',
    APP_PORT = 9090,
    to_param = function (params) {
        return Object.keys(params)
            .map(function(param) {
                return encodeURIComponent(param) + '=' + encodeURIComponent(params[param]);
            })
            .join('&');
    };

module.exports = {
    ENV: 'development',
    APP_BASE_URL: APP_BASE_URL + ':' + APP_PORT,
    BACKEND_BASE_URL: 'http://dev.gamers.tm:3000',
    PORT: APP_PORT,
    SESSION_SECRET: '',
    YOUTUBE: {
        BASE_URL: 'https://accounts.google.com',
        API_BASE_URL: 'https://www.googleapis.com/youtube/v3',
        PORT: '443',
        AUTH_URL: '/o/oauth2/auth',
        CHANNEL_URL: '/channels',
        API_KEY: '',
        client_id: '',
        client_secret: '',
        chat_redirect_uri: 'http://dev.gamers.tm:3000/chat_callback',
        own_redirect: 'http://dev.gamers.tm:9090/youtube/chat_callback',
        auth : function(params) {
            return this.BASE_URL + ':'
                + this.PORT
                + this.AUTH_URL
                + (params ? '?' + to_param(params) : '');
        },
        scopes: {
            manage: 'https://www.googleapis.com/auth/youtube.force-ssl',
            view: 'https://www.googleapis.com/auth/youtube.readonly',
            upload: 'https://www.googleapis.com/auth/youtube.upload',
            audit_details: 'https://www.googleapis.com/auth/youtubepartner-channel-audit'
        },
        gamerstm_youtuber_page: 'http://dev.gamers.tm:8080/youtubers/'
    },
};
