var express = require('express');
var controller = require('../../controllers/web/bill.web.controller');
var router = express.Router();

router.get('/', controller.list);
router.get('/sort', controller.listSort);
router.get('/view/:id', controller.view);
router.get('/insert', controller.insert);
router.post('/insert', controller.insert);

module.exports = router;