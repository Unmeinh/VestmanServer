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

exports.check_adm = (req, res, next) => {
    if (req.session.userLogin) {
        let user = req.session.userLogin

        if(user.permission < 1){
            next();
        }else{
            res.redirect('/check');
        }
  
    } else {
        return res.redirect('/login')
    }
}

exports.check_adm2 = (req, res, next) => {
    if (req.session.userLogin) {
        let user = req.session.userLogin

        if(user.permission < 2){
            next();
        }else{
            res.redirect('/check');
        }
  
    } else {
        return res.redirect('/login')
    }
}