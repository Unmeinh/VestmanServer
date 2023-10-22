exports.do_login = (req, res, next) => {
    if (req.session.userLogin) {
        //có tồn tại session login (đã đăng nhập)
        next();
    } else {
        return res.redirect('/login')
    }
}


exports.not_login = (req, res, next) => {
    if (!req.session.userLogin) {
        next();
    } else {
        //đã login rồi thì về trang chủ hay gì đó
        return res.render('/product')
    }
}