'use strict';

var util = require(__dirname + '/../helpers/util'),
    logger = require('anytv-node-logger'),
    importer = require('anytv-node-importer');

module.exports = function (router) {
    var c = importer.dirloadSync(__dirname + '/../controllers');

    router.del = router.delete;


    router.all('*', function (req, res, next) {
        util.log_request(req, logger);
        next();
    });

    router.get('/:topic_id', c.comments.get_comments);
    router.post('/:topic_id', c.comments.post_comments);
    router.get('/embed/:topic_id', c.comments.get_comments_view);
    router.get('/youtube/get_comment_threads', c.youtube.get_comment_threads);
    router.get('/youtube/get_comments', c.youtube.get_comments);
    router.get('/youtube/insert_comment_thread', c.youtube.post_comment_thread);
    router.get('/youtube/insert_comment', c.youtube.post_comment);
    router.get('/youtube/chat_callback', c.youtube.chat_callback);
    router.get('/youtube/get_channel_comments', c.youtube.get_channel_comments);

    router.get('/video/comments', c.api.get_video_comments);


    router.all('*', function (req, res) {
        res.status(404)
            .send({
                message: 'Nothing to do here.'
            });
    });

    return router;
};
