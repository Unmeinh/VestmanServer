var express = require('express');
var controller = require('../../controllers/web/blog.web.controller');
var router = express.Router();

router.get('/', controller.list);
router.get('/insert', controller.insert);
router.post('/insert', controller.insert);

module.exports = router;