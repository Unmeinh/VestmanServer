var express = require('express');
var controller = require('../../controllers/web/admin.web.controller');
var router = express.Router();

router.get('/admin', controller.list);
router.get('/register', controller.register);
router.post('/register', controller.register);
router.get('/statistical', controller.statistical);

module.exports = router;