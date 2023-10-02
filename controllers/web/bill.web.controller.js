let billModel = require("../../models/bill.model").BillModel;
let productModel = require("../../models/product.model").ProductModel;
let clientModel = require("../../models/client.model").ClientModel;

exports.list = async (req, res, next) => {
  const messages = await req.consumeFlash("info");

  const locals = {
    title: "NodeJs",
    description: "Free NodeJs User Management System",
  };

  let perPage = 5;
  let page = req.query.page || 1;

  try {
    const clients = await billModel
      .aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
    const count = await billModel.count();
    // console.log("cus: ", clients);

    let arrCli = [];
    let idCli;
    for (let i = 0; i < clients.length; i++) {
      idCli = clients[i].id_client;

      const cli = await clientModel.findOne({ _id: idCli });

      arrCli.push(cli);
      // console.log("client: "+clients[i].id_client);
    }

    res.render("viewBill", {
      locals,
      clients,
      current: page,
      pages: Math.ceil(count / perPage),
      messages,
      arrCli,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.view = async (req, res) => {
  try {
    const customer = await billModel.findOne({ _id: req.params.id });

    let arrPro = [];
    let idPro;

    for (i = 0; i < customer.arr_product.length; i++) {
      idPro = customer.arr_product[i].id_product;

      const product = await productModel.findOne({ _id: idPro });

      arrPro.push(product);
    }

    const kh = await clientModel.findOne({ _id: customer.id_client });

    const locals = {
      title: "View Customer Data",
      description: "Free NodeJs User Management System",
    };

    res.render("bill/detailBill", {
      locals,
      customer,
      arrPro,
      kh,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.insert = async (req, res, next) => {
  if (req.method == "POST") {
    let { id_client, arr_cart, total } = req.body;
    let newBill = new billModel();
    newBill.id_client = id_client;
    for (let i = 0; i < arr_cart.length; i++) {
      const cart = arr_cart[i];
      newBill.arr_product.push({
        id_product: cart.id_product,
        size: cart.size,
        quantity: cart.quantity,
      });
    }
    newBill.total = total;
    newBill.created_at = new Date();
    await newBill.save();
    return res.send(newBill);
  }
  res.send("List");
};
