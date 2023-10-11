let adminModel = require('../../models/admin.model').AdminModel;
let productModel = require('../../models/product.model').ProductModel;
let billModel = require('../../models/bill.model').BillModel;
<<<<<<< HEAD
const { onUploadImages } = require("../../function/uploadImage");
=======
>>>>>>> main
let clientModel = require('../../models/client.model').ClientModel;

exports.home = async (req, res, next) => {
  res.render('home', {title: 'Home'});
}

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

<<<<<<< HEAD
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


exports.dashboard = async (req, res, next) => {
  try {
    let listProduct = await productModel.find().sort({ quantitySold: -1 }).limit(5);
    const months = [];
    const totalBills = [];
    const totalProducts = [];
    const totalInterests = [];
    const totalCustomers = [];
    const endDate = new Date();
    const last6Month = new Date(endDate.getFullYear(), endDate.getMonth() - 5, 1);
    let currentDate = new Date(last6Month);

    while (currentDate <= endDate) {
      let previusDate = currentDate.toISOString();
      let nowDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1).toISOString();
      let date = currentDate.toLocaleString('en', { month: 'long', year: 'numeric' });
      months.push(date.substring(0, 1).toLocaleUpperCase() + date.substring(1));
      currentDate.setMonth(currentDate.getMonth() + 1);

      let total = await getTotalBill(previusDate, nowDate);
      let product = await getTotalProduct(previusDate, nowDate);
      let client = await getTotalCustomer(previusDate, nowDate);
      totalBills.push(total);
      totalProducts.push(product);
      totalInterests.push(total - product);
      totalCustomers.push(client);
    }
    res.render('admin/dashboard', {
      title: 'Dashboard',
      listProduct: JSON.stringify(listProduct),
      months: JSON.stringify(months),
      totalBills: JSON.stringify(totalBills),
      totalProducts: JSON.stringify(totalProducts),
      totalInterests: JSON.stringify(totalInterests),
      totalCustomers: JSON.stringify(totalCustomers),
    })
  } catch (error) {
    console.log(error);
    res.send(error);
  }
}

async function getTotalBill(previusDate, nowDate) {
  var match_stage = {
    $match: {
      'created_at': {
        '$gte': new Date(previusDate),
        '$lte': new Date(nowDate)
      }
    }
  }
  var group_stage = {
    $group: { _id: null, sum: { $sum: "$total" } }
  }
  var project_stage = {
    $project: { _id: 0, total: '$sum' }
  }

  var pipeline = [match_stage, group_stage, project_stage]
  let sumTotal = await billModel.aggregate(pipeline);
  if (sumTotal[0] != undefined) {
    return sumTotal[0].total;
  } else {
    return 0;
  }
}

async function getTotalProduct(previusDate, nowDate) {
  let productPrice = await productModel.find(
    {
      created_at: {
        $gte: previusDate,
        $lte: nowDate
      }
    }
  );
  if (productPrice[0] != undefined) {
    return productPrice[0].price * productPrice[0].quantity;
  } else {
    return 0;
  }
}

async function getTotalCustomer(previusDate, nowDate) {
  let listClient = await clientModel.find(
    {
      created_at: {
        $gte: previusDate,
        $lte: nowDate
      }
    }
  );
  if (listClient) {
    return listClient.length;
  } else {
    return 0;
  }
}

=======
exports.dashboard = async (req, res, next) => {
  try {
    let listProduct = await productModel.find().sort({ quantitySold: -1 }).limit(5);
    const months = [];
    const totalBills = [];
    const totalProducts = [];
    const totalInterests = [];
    const totalCustomers = [];
    const endDate = new Date();
    const last6Month = new Date(endDate.getFullYear(), endDate.getMonth() - 5, 1);
    let currentDate = new Date(last6Month);

    while (currentDate <= endDate) {
      let previusDate = currentDate.toISOString();
      let nowDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1).toISOString();
      let date = currentDate.toLocaleString('en', { month: 'long', year: 'numeric' });
      months.push(date.substring(0, 1).toLocaleUpperCase() + date.substring(1));
      currentDate.setMonth(currentDate.getMonth() + 1);

      let total = await getTotalBill(previusDate, nowDate);
      let product = await getTotalProduct(previusDate, nowDate);
      let client = await getTotalCustomer(previusDate, nowDate);
      totalBills.push(total);
      totalProducts.push(product);
      totalInterests.push(total - product);
      totalCustomers.push(client);
    }
    res.render('admin/dashboard', {
      title: 'Dashboard',
      listProduct: JSON.stringify(listProduct),
      months: JSON.stringify(months),
      totalBills: JSON.stringify(totalBills),
      totalProducts: JSON.stringify(totalProducts),
      totalInterests: JSON.stringify(totalInterests),
      totalCustomers: JSON.stringify(totalCustomers),
    })
  } catch (error) {
    console.log(error);
    res.send(error);
  }
}

async function getTotalBill(previusDate, nowDate) {
  var match_stage = {
    $match: {
      'created_at': {
        '$gte': new Date(previusDate),
        '$lte': new Date(nowDate)
      }
    }
  }
  var group_stage = {
    $group: { _id: null, sum: { $sum: "$total" } }
  }
  var project_stage = {
    $project: { _id: 0, total: '$sum' }
  }

  var pipeline = [match_stage, group_stage, project_stage]
  let sumTotal = await billModel.aggregate(pipeline);
  if (sumTotal[0] != undefined) {
    return sumTotal[0].total;
  } else {
    return 0;
  }
}

async function getTotalProduct(previusDate, nowDate) {
  let productPrice = await productModel.find(
    {
      created_at: {
        $gte: previusDate,
        $lte: nowDate
      }
    }
  );
  if (productPrice[0] != undefined) {
    return productPrice[0].price * productPrice[0].quantity;
  } else {
    return 0;
  }
}

async function getTotalCustomer(previusDate, nowDate) {
  let listClient = await clientModel.find(
    {
      created_at: {
        $gte: previusDate,
        $lte: nowDate
      }
    }
  );
  if (listClient) {
    return listClient.length;
  } else {
    return 0;
  }
}
>>>>>>> main
