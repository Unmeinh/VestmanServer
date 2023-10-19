var express = require('express');
var controller = require('../../controllers/web/admin.web.controller');
var router = express.Router();
var multer = require('multer');
var uploader = multer({dest:'/public/tmp'});


router.get('/', controller.list);
router.get('/sort', controller.listSort);
router.get('/view/:id', controller.view);
router.get('/register', controller.register);
router.post('/register', uploader.any(), controller.register);
router.get('/edit/:id', controller.edit);
router.post('/edit', uploader.any(), controller.editPost);
router.post('/delete/:id', controller.delete);
router.get('/dashboard', controller.dashboard);

module.exports = router;