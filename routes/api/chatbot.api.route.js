var express = require('express');
var controller = require('../../controllers/api/chatbot.api.controller');
var router = express.Router();

router.get('/product/:idProduct', controller.getChatbot);

module.exports = router;