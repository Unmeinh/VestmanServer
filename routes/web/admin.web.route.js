var express = require('express');
var controller = require('../../controllers/web/admin.web.controller');
var router = express.Router();
var multer = require('multer');
var uploader = multer({dest:'/public/tmp'});

<<<<<<< HEAD
router.get('/', controller.list);
router.get('/sort', controller.listSort);
router.get('/high', controller.listHigh);
router.get('/view/:id', controller.view);
router.get('/register', controller.register);
router.post('/register', uploader.any(), controller.register);
router.get('/edit/:id', controller.edit);
router.post('/edit', uploader.any(), controller.editPost);
router.post('/delete/:id', controller.delete);
=======
router.get('/', controller.home);
router.get('/home', controller.home);
router.get('/admin/view/:id', controller.view);
router.get('/register', controller.register);
router.post('/register', controller.register);
>>>>>>> main
router.get('/admin/dashboard', controller.dashboard);

module.exports = router;