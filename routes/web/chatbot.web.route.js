var express = require('express');
var controller = require('../../controllers/web/chatbot.web.controller');
var router = express.Router();
var {do_login, check_adm, check_adm2} =require('../../midleware/midleware');


router.use(do_login);

router.get('/', controller.list);

router.use(check_adm2);
router.get('/insert', controller.insert);
router.post('/insert', controller.insert);

module.exports = router;