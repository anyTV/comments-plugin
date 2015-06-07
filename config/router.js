'use strict';

var importer = require('anytv-node-importer');

module.exports = function (router) {
    var c = importer.dirloadSync(__dirname + '/../controllers');

    router.del = router.delete;

    router.get('/:topic_id', c.comments.get_comments);
    router.post('/:topic_id', c.comments.post_comments);
    router.get('/embed/:topic_id', c.comments.get_comments_view);

    router.all('*', function (req, res) {
        res.status(404)
            .send({
                message: 'Nothing to do here.'
            });
    });

    return router;
};
