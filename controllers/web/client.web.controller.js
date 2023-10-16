let clientModel = require('../../models/client.model').ClientModel;
const { onUploadImages } = require("../../function/uploadImage");


exports.list = async (req, res, next) => {
    const messages = await req.consumeFlash('info');
    const locals = {
      title: 'NodeJs',
      description: 'Free NodeJs User Management System'
    }

    let perPage = 5;
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

exports.listSort = async (req, res, next) => {
  const messages = await req.consumeFlash('info');
  const locals = {
    title: 'NodeJs',
    description: 'Free NodeJs User Management System'
  }

  let perPage = 5;
  let page = req.query.page || 1;

  try {
    const clients = await clientModel.aggregate()
      .sort({"full_name": 1})
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

exports.listHigh = async (req, res, next) => {
  const messages = await req.consumeFlash('info');
  const locals = {
    title: 'NodeJs',
    description: 'Free NodeJs User Management System'
  }

  let perPage = 5;
  let page = req.query.page || 1;

  try {
    const clients = await clientModel.aggregate()
      .sort({"full_name": -1})
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
        let imageUrl = await onUploadImages(req.files, 'admin');
        let { username, password, email, full_name, phone_number, address } = req.body;
        let newClient = new clientModel();
        newClient.username = username;
        newClient.password = password;
        newClient.full_name = full_name;
        newClient.email = email;
        newClient.phone_number = phone_number;
        newClient.address = address;
        newClient.created_at = new Date();
        newClient.avatar = imageUrl[0];
        await newClient.save();
        return res.redirect('/client');
    }
    res.render('client/add')
}

exports.edit = async (req, res) => {
  try {
    const cli = await clientModel.findById({_id : req.params.id});
    
    res.render("client/editClient",{
      cli
    })

  } catch (error) {
    console.log(error);
  }

}
  
exports.editPost = async (req, res, next) => {
  let { username, password, email, full_name, phone_number, address, avatar, _id, created_at } = req.body;

  const imageUrl = await onUploadImages(req.files, 'admin');

    if(!imageUrl.length==0){
      avatar = imageUrl[0];
    }

    await clientModel.findByIdAndUpdate(_id,{
      username : username,
      password : password,
      email : email,
      full_name : full_name,
      phone_number : phone_number,
      address : address,
      avatar : avatar,
      created_at : created_at,
    });

    res.redirect('/client');

}

exports.delete = async (req, res, next) => {
  await clientModel.deleteOne({_id: req.params.id})
  res.redirect('/client');
}