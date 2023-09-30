let adminModel = require('../../models/admin.model').AdminModel;

exports.list = async (req, res, next) => {
    const messages = await req.consumeFlash('info');
    const locals = {
      title: 'NodeJs',
      description: 'Free NodeJs User Management System'
    }

    let perPage = 2;
    let page = req.query.page || 1;

    try {
      const clients = await adminModel.aggregate([ { $sort: { createdAt: -1 } } ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec(); 
      const count = await adminModel.count();
      console.log("cus: ",clients);

      res.render('viewAdmin', {
        locals,
        clients,
        current: page,
        pages: Math.ceil(count / perPage),
        messages
      });

    } catch (error) {
      console.log(error);
    }
}

exports.view = async (req, res) => {

  try {
    const customer = await adminModel.findOne({ _id: req.params.id })

    const locals = {
      title: "View Customer Data",
      description: "Free NodeJs User Management System",
    };

    res.render('admin/detailAdm', {
      locals,
      customer
    })

  } catch (error) {
    console.log(error);
  }

}

exports.register = async (req, res, next) => {
    if (req.method == "POST") {
        let { username, password, permission, full_name } = req.body;
        let newAdmin = new adminModel();
        newAdmin.username = username;
        newAdmin.password = password;
        newAdmin.full_name = full_name;
        newAdmin.permission = permission;
        newAdmin.created_at = new Date();
        newAdmin.avatar = "https://firebasestorage.googleapis.com/v0/b/vestman-firebase-ada53.appspot.com/o/images%2Favatar%2Fadmin%2Fadminvest.jpg?alt=media&token=ca361115-f919-44df-86fe-e8c930bbe10d";
        await newAdmin.save();
        return res.send(newAdmin);
    }
    res.send('List')
}