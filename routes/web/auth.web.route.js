var express = require('express');
var controller = require('../../controllers/web/auth.web.controller');
var router = express.Router();
var midleware=require('../../midleware/midleware')

// router.get('/',controller.home);
// router.get('/home',controller.home);
router.get('/check',controller.check);
router.get('/login',controller.login);
router.post('/login',midleware.not_login, controller.login)
router.get('/register',controller.register);
router.post('/register',midleware.not_login, controller.register);

module.exports = router;