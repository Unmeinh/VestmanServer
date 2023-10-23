var express = require('express');
var controller = require('../../controllers/web/product.web.controller');
var multer = require('multer');
var uploader = multer({dest:'/public/tmp'});
var router = express.Router();
var {do_login, check_adm2} =require('../../midleware/midleware');


router.use(do_login);

router.get('/', controller.list);
router.get('/sort', controller.listSort);
router.get('/view/:id', controller.view);

router.use(check_adm2);

router.get('/insert', controller.insert);
router.post('/insert', uploader.any(), controller.insert);
router.get('/edit/:id', controller.edit);
router.post('/edit', uploader.any(), controller.editPost);
router.post('/delete/:id', controller.delete);



module.exports = router;