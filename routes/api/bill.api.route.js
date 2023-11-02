var express = require('express');
var controller = require('../../controllers/api/bill.api.controller');
var router = express.Router();

router.get('/list/:idClient', controller.list);
router.get('/list/incomplete/:idClient', controller.listIncomplete);
router.get('/list/complete/:idClient', controller.listComplete);
router.post('/insert/:idClient', controller.insert);
router.put('/confirmReceive/:idBill', controller.confirmReceive);

module.exports = router;