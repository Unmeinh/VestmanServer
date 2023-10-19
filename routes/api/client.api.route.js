var express = require('express');
var controller = require('../../controllers/api/client.api.controller');
var router = express.Router();
var multer = require('multer');
var uploader = multer({dest:'/public/tmp'});

router.get('/list', controller.list);
router.get('/detailClient/:idClient', controller.getUser);
router.post('/login', controller.login);
router.post('/register', controller.register);
router.put('/updateClient/:idClient', controller.updateClient);
router.put('/updateAvatar/:idClient', uploader.any(), controller.updateAvatar);
router.put('/updatePassword/:idClient', controller.updatePassword);

module.exports = router;