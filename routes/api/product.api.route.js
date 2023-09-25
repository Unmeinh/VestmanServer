var express = require('express');
var controller = require('../../controllers/api/product.api.controller');
var router = express.Router();

router.get('/list', controller.list);

module.exports = router;