var express = require('express');
var controller = require('../../controllers/web/blog.web.controller');
var router = express.Router();

router.get('/', controller.list);

module.exports = router;