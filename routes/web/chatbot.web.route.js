var express = require('express');
var controller = require('../../controllers/web/chatbot.web.controller');
var router = express.Router();
var midleware=require('../../midleware/midleware')

router.use(midleware.do_login);

router.get('/', controller.list);
router.get('/insert', controller.insert);
router.post('/insert', controller.insert);

module.exports = router;