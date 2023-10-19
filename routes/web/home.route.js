var express = require('express');
var controller = require('../../controllers/web/admin.web.controller');
var router = express.Router();

router.get('/', controller.home);

module.exports = router;