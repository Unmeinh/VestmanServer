var express = require('express');
var controller = require('../../controllers/web/admin.web.controller');
var router = express.Router();

router.get('/', controller.home);
router.get('/home', controller.home);
router.get('/admin/view/:id', controller.view);
router.get('/register', controller.register);
router.post('/register', controller.register);
router.get('/admin/dashboard', controller.dashboard);

module.exports = router;