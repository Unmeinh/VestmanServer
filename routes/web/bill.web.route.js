var express = require('express');
var controller = require('../../controllers/web/bill.web.controller');
var router = express.Router();
var {do_login, check_adm2} =require('../../midleware/midleware');



router.use(do_login);

router.get('/', controller.list);
router.get('/sort', controller.listSort);
router.get('/view/:id', controller.view);
router.get('/insert', controller.insert);
router.post('/insert', controller.insert);
router.get('/confirmBill/:id', controller.confirmBill);
router.get('/confirmDelivery/:id', controller.confirmDelivery);

module.exports = router;