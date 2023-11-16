var express = require('express');
var controller = require('../../controllers/web/bill.web.controller');
var router = express.Router();
var {do_login, check_adm2} =require('../../midleware/midleware');

router.use(do_login);

router.get('/', controller.list);
router.get('/sort', controller.listSort);
router.get('/view/:id', controller.view);

router.get('/pro', controller.listPro);
router.get('/pro/sort', controller.listSortPro);
router.delete('/pro/delete/:id', controller.deletePro);


router.get('/insert', controller.insert);
router.post('/insert', controller.insert);
router.get('/confirmBill/:id', check_adm2, controller.confirmBill);
router.get('/confirmDelivery/:id', check_adm2, controller.confirmDelivery);

module.exports = router;