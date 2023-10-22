var express = require('express');
var controller = require('../../controllers/web/client.web.controller');
var multer = require('multer');
var uploader = multer({dest:'/public/tmp'});
var router = express.Router();

var midleware=require('../../midleware/midleware')

router.use(midleware.do_login);

router.get('/', controller.list);
router.get('/sort', controller.listSort);
router.get('/view/:id', controller.view);
router.get('/insert', controller.insert);
router.post('/insert', uploader.any(), controller.insert);
router.post('/delete/:id', controller.delete);

module.exports = router;