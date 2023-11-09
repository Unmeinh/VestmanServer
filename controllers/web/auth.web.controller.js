let adminModel = require("../../models/admin.model").AdminModel;

exports.ren = async (req, res, next) => {
  res.redirect("/login");
};

exports.redirect = async (req, res, next) => {
  res.redirect("/admin/dashboard");
};

exports.check = async (req, res, next) => {
  res.render("auth/check.ejs");
};

exports.login = async (req, res, next) => {
  let msg = "";
  if (req.method == "POST") {
    // lay thong tin dang nhap
    try {
      let objU = await adminModel.findOne({ username: req.body.username });

      if (objU != null) {
        // ton taij user
        if (objU.password == req.body.password) {
          req.session.userLogin = objU;
          return res.redirect("/product");
        } else {
          msg = " Password Error";
        }
      } else {
        msg = "Not found user   " + req.body.username;
      }
    } catch (error) {
      msg = error.massage;
    }
  }
  res.render("auth/login.ejs", { msg: msg });
};

exports.register = async (req, res, next) => {
  let msg = "";
  let data = {};

  if (req.method == "POST") {
    try {
      let pw = req.body.password
      if (pw.length < 8) {
        msg = "mật khẩu không đủ 8 kí tự";
        data = await req.body;
        data.password2 = "";
        data.password = "";
        return res.render("auth/register.ejs", { msg: msg, data });
      }

      if (req.body.password != req.body.password2) {
        msg = "mật khẩu không khớp";
        data = await req.body;
        data.password2 = "";
        return res.render("auth/register.ejs", { msg: msg, data });
      }

      

      let objU = new adminModel();

      objU.username = req.body.username;
      objU.full_name = req.body.full_name;
      objU.permission = 2;
      objU.avatar =
        "https://firebasestorage.googleapis.com/v0/b/shopping-6b085.appspot.com/o/user%2Fuser.png?alt=media&token=794ad4dc-302b-4708-b102-ccbaf80ea567&_gl=1*e1jpw6*_ga*NDE5OTAxOTY1LjE2OTUwMDQ5MjM.*_ga_CW55HF8NVT*MTY5NzExMzA0MS4yMS4xLjE2OTcxMTMzMjcuNTkuMC4w";
      objU.password = req.body.password;
      objU.email = req.body.email;
      objU.adress = req.body.adress;

      objU.created_at = new Date();
      await objU.save();

      msg = "đăng kí thành công ";
    } catch (error) {
      msg = "đăng kí thất bại" + error;
    }

    return res.render("auth/login.ejs", { msg: msg});
  }

  res.render("auth/register.ejs", { msg: msg, data });
};
