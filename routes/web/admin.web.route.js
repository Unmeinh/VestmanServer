var express = require('express');
var controller = require('../../controllers/web/admin.web.controller');
var router = express.Router();
var multer = require('multer');
var uploader = multer({dest:'/public/tmp'});

var {do_login, check_adm, check_adm2} =require('../../midleware/midleware')


router.use(do_login);

router.get('/logout',controller.logout)
router.get('/info',controller.info)
router.get('/info/editinfo',controller.editinfo);
router.post('/info/editinfo', uploader.any(),controller.editinfo);

router.get('/', controller.list);
router.get('/sort', controller.listSort);
router.get('/view/:id', controller.view);
router.get('/insert', check_adm, controller.insert);
router.post('/insert', check_adm, uploader.any(), controller.insert);
router.get('/edit/:id', check_adm, controller.edit);
router.post('/edit', check_adm, uploader.any(), controller.editPost);
router.post('/delete/:id',check_adm, controller.delete);
router.get('/dashboard', check_adm2, controller.dashboard);

module.exports = router;