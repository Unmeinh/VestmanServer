var express = require('express');
var controller = require('../../controllers/api/discount.api.controller');
var router = express.Router();

router.get('/', controller.list);

module.exports = router;