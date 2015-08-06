'use strict';

var config = require(__dirname + '/config/config'),
    util = require(__dirname + '/helpers/util'),
    express = require('express'),
    body_parser = require('body-parser'),
    cookie_parser = require('cookie-parser'),
    logger = require('anytv-node-logger'),
    app = express(),
    redis = require('redis'),
    session = require('express-session'),
    redis_store = require('connect-redis')(session),
    redis_store_session = new redis_store({
        host: 'localhost',
        port: 6379,
        client: redis.createClient()
    });

logger.log('info', 'Starting', config.APP_NAME, 'on', config.ENV, 'environment');

app.disable('x-powered-by');

app.set('views', config.VIEWS_DIR);
app.set('view engine', 'jade');

logger.log('verbose', 'Binding 3rd-party middlewares');

app.use(require('morgan')('combined', {stream: util.get_log_stream(config.LOGS_DIR)}));
app.use(require('method-override')());
app.use(body_parser.urlencoded({extended: true}));
app.use(require('compression')());

logger.log('verbose', 'Binding custom middlewares');
app.use(require('anytv-node-cors')(config.CORS));
app.use('/assets', express.static(__dirname + '/views/assets'));

app.use(cookie_parser('1234567890QWERTY'));
app.use(session({
    cookie: {
        maxAge: 6000000
    },
    secret: '1234567890QWERTY',
    resave: false,
    saveUninitialized: true,
    store: redis_store_session
}));

app.use(require(__dirname + '/config/router')(express.Router()));
app.use(require('anytv-node-error-handler')(logger));

app.listen(config.PORT);
logger.log('info', 'Server listening on port', config.PORT);

module.exports = app;
