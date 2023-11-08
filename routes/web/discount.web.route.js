var express = require('express');
var controller = require('../../controllers/web/discount.web.controller');
var router = express.Router();
var {do_login, check_adm2} =require('../../midleware/midleware');



router.use(do_login);

router.get('/', controller.list);
router.get('/sort', controller.listSort);

router.use(check_adm2);
router.get('/insert', controller.insert);
router.post('/insert', controller.insert);
router.get('/edit/:id', controller.edit);
router.post('/edit', controller.editPost);
router.delete('/delete/:id', controller.delete);

module.exports = router;