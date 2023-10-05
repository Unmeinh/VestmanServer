var express = require('express');
var controller = require('../../controllers/api/cart.api.controller');
var router = express.Router();

router.get('/list/:idClient', controller.list);
router.post('/insert/:idClient', controller.insertCart);
router.put('/update/:idCart', controller.updateCart);
router.delete('/delete/:idCart', controller.deleteCart);

module.exports = router;