var express = require('express');
var controller = require('../../controllers/web/product.web.controller');
var router = express.Router();
var multer = require('multer');
var uploader = multer({dest:'/public/tmp'});

router.get('/', controller.list);
router.get('/product/sort', controller.listSort);
router.get('/product/high', controller.listHigh);
router.get('/product/view/:id', controller.view);
router.get('/product/insert', controller.insert);
// router.post('/insert/sizes', uploader.any(), controller.insertSizes);
router.post('/product/insert', uploader.any(), controller.insert);
router.get('/product/edit/:id', controller.edit);
router.post('/product/edit', uploader.any(), controller.editPost);
router.post('/product/delete/:id', controller.delete);


module.exports = router;