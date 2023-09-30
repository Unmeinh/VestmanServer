var express = require('express');
var controller = require('../../controllers/web/admin.web.controller');
var router = express.Router();

router.get('/', controller.list);
router.get('/view/:id', controller.view);
router.get('/register', controller.register);
router.post('/register', controller.register);

module.exports = router;