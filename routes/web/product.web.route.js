var express = require('express');
var controller = require('../../controllers/web/product.web.controller');
var router = express.Router();
var multer = require('multer');
var uploader = multer({dest:'/public/tmp'});

router.get('/', controller.list);
router.get('/view/:id', controller.view);
router.get('/insert', controller.insert);
router.post('/insert', uploader.any(), controller.insert);

module.exports = router;