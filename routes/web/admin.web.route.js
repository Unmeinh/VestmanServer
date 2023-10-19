var express = require('express');
var controller = require('../../controllers/web/admin.web.controller');
var router = express.Router();

var midleware=require('../../midleware/midleware')


// router.get('/', controller.list);
// router.get('/view/:id', controller.view);

// router.get('/statistical', controller.statistical);

router.get('/login',midleware.not_login, controller.login);
router.post('/login',midleware.not_login, controller.login)
router.get('/register',midleware.not_login, controller.register);
router.post('/register',midleware.not_login, controller.register);
router.post('/logout',controller.Logout)
router.get('/info',controller.info)
router.get('/info/editinfo',controller.editinfo);
router.post('/info/editinfo',controller.editinfo);





var multer = require('multer');
var uploader = multer({dest:'/public/tmp'});

router.get('/', controller.list);
router.get('/list', controller.list);
router.get('/sort', controller.listSort);
router.get('/view/:id', controller.view);
router.get('/register', controller.register);
router.post('/register', uploader.any(), controller.register);
router.get('/edit/:id', controller.edit);
router.post('/edit', uploader.any(), controller.editPost);
router.post('/delete/:id', controller.delete);
router.get('/dashboard', controller.dashboard);


module.exports = router;