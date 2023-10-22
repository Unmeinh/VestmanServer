var express = require('express');
var controller = require('../../controllers/web/admin.web.controller');
var router = express.Router();
var multer = require('multer');
var uploader = multer({dest:'/public/tmp'});

var midleware=require('../../midleware/midleware')


router.post('/login',midleware.not_login, controller.login)
router.post('/register',midleware.not_login, controller.register);
router.post('/logout',controller.Logout)
router.get('/info',controller.info)
router.get('/info/editinfo',controller.editinfo);
router.post('/info/editinfo', uploader.any(),controller.editinfo);

router.use(midleware.do_login);
router.get('/', controller.list);
router.get('/list', controller.list);
router.get('/sort', controller.listSort);
router.get('/view/:id', controller.view);
router.get('/insert', controller.insert);
router.post('/insert', uploader.any(), controller.insert);
router.get('/edit/:id', controller.edit);
router.post('/edit', uploader.any(), controller.editPost);
router.post('/delete/:id', controller.delete);
router.get('/dashboard', controller.dashboard);


module.exports = router;