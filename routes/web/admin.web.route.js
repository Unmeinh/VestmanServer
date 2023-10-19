var express = require('express');
var controller = require('../../controllers/web/admin.web.controller');
var router = express.Router();
var midleware=require('../../midleware/midleware')


// router.get('/', controller.list);
// router.get('/view/:id', controller.view);

// router.get('/statistical', controller.statistical);

router.get('/login',midleware.not_login, controller.login);
router.post('/login',midleware.not_login, controller.login)
router.get('/register',midleware.not_login, controller.register);
router.post('/register',midleware.not_login, controller.register);
router.post('/logout',controller.Logout)
router.get('/info',controller.info)
router.get('/info/editinfo',controller.editinfo);
router.post('/info/editinfo',controller.editinfo);





module.exports = router;