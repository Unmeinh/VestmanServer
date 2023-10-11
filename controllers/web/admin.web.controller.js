let adminModel = require('../../models/admin.model').AdminModel;
let productModel = require('../../models/product.model').ProductModel;
let billModel = require('../../models/bill.model').BillModel;
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
    const clients = await adminModel.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
    const count = await adminModel.count();
    console.log("cus: ", clients);

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

exports.listSort = async (req, res, next) => {
  const messages = await req.consumeFlash('info');
  const locals = {
    title: 'NodeJs',
    description: 'Free NodeJs User Management System'
  }

  let perPage = 5;
  let page = req.query.page || 1;

  try {
    const clients = await adminModel.aggregate()
      .sort({'full_name': 1})
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
    const count = await adminModel.count();
    console.log("cus: ", clients);

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

exports.listHigh = async (req, res, next) => {
  const messages = await req.consumeFlash('info');
  const locals = {
    title: 'NodeJs',
    description: 'Free NodeJs User Management System'
  }

  let perPage = 5;
  let page = req.query.page || 1;

  try {
    const clients = await adminModel.aggregate()
      .sort({'full_name': -1})
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
    const count = await adminModel.count();
    console.log("cus: ", clients);

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
    let imageUrl = await onUploadImages(req.files, 'admin');
   
    let { username, password, permission, full_name } = req.body;
    let newAdmin = new adminModel();
    newAdmin.username = username;
    newAdmin.password = password;
    newAdmin.full_name = full_name;
    newAdmin.permission = permission;
    newAdmin.created_at = new Date();
    newAdmin.avatar = imageUrl[0];
    await newAdmin.save();
    return res.redirect('/admin');
  }

  res.render('admin/addAdm');
  
}

exports.edit = async (req, res, next) => {
  try {
    const adm = await adminModel.findById({_id : req.params.id});
    
    res.render("admin/editAdm",{
      adm
    })

  } catch (error) {
    console.log(error);
  }
}
  
exports.editPost = async (req, res, next) => {
  let { username, password, permission, full_name, avatar, _id, created_at } = req.body;
  const imageUrl = await onUploadImages(req.files, 'admin');

  if(!imageUrl.length==0){
    avatar = imageUrl[0];
  }

  await adminModel.findByIdAndUpdate(_id,{
    username : username,
    password : password,
    permission : permission,
    full_name : full_name,
    avatar : avatar,
    created_at : created_at,
  });

  res.redirect('/admin');
}

exports.delete = async (req, res, next) => {
  await adminModel.deleteOne({_id: req.params.id})
  res.redirect('/client');
}


exports.statistical = async (req, res, next) => {
  let lastYear = new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().slice(0, 10);
  let listBillByYear = await billModel.find({ created_at: { $gte: lastYear } });
  let listProduct = await productModel.find().sort({ quantitySold: -1 }).limit(5);
  const months = [];
  const endDate = new Date();
  const last6Month = new Date(endDate.getFullYear(), endDate.getMonth() - 5, 1);
  let currentDate = new Date(last6Month);

  while (currentDate <= endDate) {
    let backDate = currentDate.toISOString();
    let nowDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1).toISOString();
    months.push(currentDate.toLocaleString('default', { month: '2-digit', year: 'numeric' }));
    currentDate.setMonth(currentDate.getMonth() + 1);
    let sum = await billModel.aggregate([
      {
        $match: {
          $and: [
            { created_at: { $gte: backDate } },
            { created_at: { $lte: nowDate } }
          ]
        }
      },
      { $group: { _id: null, sum: { $sum: "$total" } } },
      { $project: { _id: 0, total: '$sum' } }
    ]);
    console.log(sum);
  }
  res.render('admin/statisticalAdm', { title: 'Statistical', listProduct: JSON.stringify(listProduct) })
}

