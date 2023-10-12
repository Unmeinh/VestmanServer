let adminModel = require('../../models/admin.model').AdminModel;
let productModel = require('../../models/product.model').ProductModel;
let billModel = require('../../models/bill.model').BillModel;
let clientModel = require('../../models/client.model').ClientModel;

exports.home = async (req, res, next) => {
  res.render('home', { title: 'Home' });
}

exports.list = async (req, res, next) => {
  const messages = await req.consumeFlash('info');
  const locals = {
    title: 'NodeJs',
    description: 'Free NodeJs User Management System'
  }

  let perPage = 2;
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

exports.dashboard = async (req, res, next) => {
  try {
    let listProduct = await productModel.find().sort({ quantitySold: -1 }).limit(5);
    const months = [];
    const totalBills = [];
    const totalProducts = [];
    const totalInterests = [];
    const totalCustomers = [];
    const totalPrdCount = [];
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
      let count = await getProductCount(previusDate, nowDate);
      totalBills.push(total);
      totalProducts.push(product);
      totalInterests.push(total - product);
      totalCustomers.push(client);
      totalPrdCount.push(count);
    }
    res.render('admin/dashboard', {
      title: 'Dashboard',
      listProduct: JSON.stringify(listProduct),
      months: JSON.stringify(months),
      totalBills: JSON.stringify(totalBills),
      totalProducts: JSON.stringify(totalProducts),
      totalInterests: JSON.stringify(totalInterests),
      totalCustomers: JSON.stringify(totalCustomers),
      totalPrdCount: JSON.stringify(totalPrdCount)
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

async function getProductCount(previusDate, nowDate) {
  var match_stage = {
    $match: {
      'created_at': {
        '$gte': new Date(previusDate),
        '$lte': new Date(nowDate)
      }
    }
  }
  var unwind_stage = {
    $unwind: "$arr_product",
  }
  var group_stage = {
    $group: { _id: null, sum: { $sum: "$arr_product.quantity" } }
  }
  var project_stage = {
    $project: { _id: 0, count: '$sum' }
  }

  var pipeline = [match_stage, unwind_stage, group_stage, project_stage]
  let sumCount = await billModel.aggregate(pipeline);
  if (sumCount[0] != undefined) {
    return sumCount[0].count;
  } else {
    return 0;
  }
}

