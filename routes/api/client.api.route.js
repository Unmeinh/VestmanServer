var express = require('express');
var controller = require('../../controllers/api/client.api.controller');
var router = express.Router();

router.get('/list', controller.list);
router.post('/login', controller.login);
router.post('/register', controller.register);
router.put('/updateClient/:idClient', controller.updateClient);
router.put('/updateAvatar/:idClient', controller.updateAvatar);
router.put('/updatePassword/:idClient', controller.updatePassword);

module.exports = router;