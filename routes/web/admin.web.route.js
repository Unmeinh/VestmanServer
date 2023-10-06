var express = require('express');
var controller = require('../../controllers/web/admin.web.controller');
var router = express.Router();
var multer = require('multer');
var uploader = multer({dest:'/public/tmp'});

router.get('/', controller.list);
router.get('/view/:id', controller.view);
router.get('/register', controller.register);
router.post('/register', uploader.any(), controller.register);
router.get('/statistical', controller.statistical);

module.exports = router;