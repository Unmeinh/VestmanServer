var express = require('express');
var controller = require('../../controllers/web/navi.web.controller');
var router = express.Router();

router.get('/navi',controller.navi)

// router.use((req, res, next) => {

//     if (req.session.userLogin) {
//         next()
//     }

//     else {
//         return res.redirect('/navi')
//     }

// })
// router.get('/logout', (req, res) => {
//     req.session.destroy(
//         res.redirect('/admin/login')
//     )
// })

module.exports=router;