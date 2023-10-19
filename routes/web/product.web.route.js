var express = require('express');
var controller = require('../../controllers/web/product.web.controller');
var router = express.Router();

var midleware=require('../../midleware/midleware')
router.use(midleware.do_login);

var multer = require('multer');
var uploader = multer({dest:'/public/tmp'});


router.get('/', controller.list);
router.get('/sort', controller.listSort);
router.get('/view/:id', controller.view);
router.get('/insert', controller.insert);
router.post('/insert', uploader.any(), controller.insert);
router.get('/edit/:id', controller.edit);
router.post('/edit', uploader.any(), controller.editPost);
router.post('/delete/:id', controller.delete);



module.exports = router;