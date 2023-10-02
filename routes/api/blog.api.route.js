var express = require('express');
var controller = require('../../controllers/api/blog.api.controller');
var router = express.Router();

router.get('/list', controller.list);

module.exports = router;