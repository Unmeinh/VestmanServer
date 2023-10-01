const { ClientModel } = require('../../models/client.model');

let clientModel = require('../../models/client.model').ClientModel;

exports.list = async (req, res, next) => {
    const messages = await req.consumeFlash('info');
    const locals = {
      title: 'NodeJs',
      description: 'Free NodeJs User Management System'
    }

    let perPage = 2;
    let page = req.query.page || 1;

    try {
      const clients = await clientModel.aggregate([ { $sort: { createdAt: -1 } } ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec(); 
      const count = await clientModel.count();
      console.log("cus: ",clients);

      res.render('viewClient', {
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
    const customer = await clientModel.findOne({ _id: req.params.id })

    const locals = {
      title: "View Customer Data",
      description: "Free NodeJs User Management System",
    };

    res.render('client/detail', {
      locals,
      customer
    })

  } catch (error) {
    console.log(error);
  }

}

exports.insert = async (req, res, next) => {
    if (req.method == "POST") {
        let { username, password, email, full_name, phone_number, address } = req.body;
        let newClient = new clientModel();
        newClient.username = username;
        newClient.password = password;
        newClient.full_name = full_name;
        newClient.email = email;
        newClient.phone_number = phone_number;
        newClient.address = address;
        newClient.created_at = new Date();
        newClient.avatar = "https://png.pngtree.com/png-vector/20190822/ourmid/pngtree-avatar-client-face-happy-man-person-user-business-flat-li-png-image_1695892.jpg";
        await newClient.save();
        return res.send(newClient);
    }
    res.send('List')
}