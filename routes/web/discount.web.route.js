var express = require('express');
var controller = require('../../controllers/web/discount.web.controller');
var router = express.Router();
var midleware=require('../../midleware/midleware')
router.use(midleware.do_login);

router.get('/', controller.list);
router.get('/sort', controller.listSort);
router.get('/insert', controller.insert);
router.post('/insert', controller.insert);
router.get('/edit/:id', controller.edit);
router.post('/edit', controller.editPost);
router.post('/delete/:id', controller.delete);

module.exports = router;