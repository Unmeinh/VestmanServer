let adminModel = require('../../models/admin.model').AdminModel;
let productModel = require('../../models/product.model').ProductModel;
let billModel = require('../../models/bill.model').BillModel;

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