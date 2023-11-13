let billModel = require("../../models/bill.model").BillModel;
let productModel = require("../../models/product.model").ProductModel;
let clientModel = require("../../models/client.model").ClientModel;
let billProduct = require("../../models/billProduct.model").BillProduct;

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
      if (clients[i].status != undefined) {
        switch (clients[i].status) {
          case -1:
            clients[i].statusText = "Unconfimred"
            break;
          case 0:
            clients[i].statusText = "Delivering"
            break;
          case 1:
            clients[i].statusText = "Delivered"
            break;
          case 2:
            clients[i].statusText = "Received"
            break;

          default:
            break;
        }
      }
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

exports.listSort = async (req, res, next) => {
  const messages = await req.consumeFlash("info");

  const locals = {
    title: "NodeJs",
    description: "Free NodeJs User Management System",
  };

  let perPage = 5;
  let page = req.query.page || 1;

  try {
    if (req.query.hasOwnProperty("_sort")) {
      const clients = await billModel
        .aggregate()
        .sort({ [req.query.column]: req.query.type })
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();
      const count = await billModel.count();

      let arrCli = [];
      let idCli;
      for (let i = 0; i < clients.length; i++) {
        idCli = clients[i].id_client;

        const cli = await clientModel.findOne({ _id: idCli });

        arrCli.push(cli);
      }

      res.render("viewBill", {
        locals,
        clients,
        current: page,
        pages: Math.ceil(count / perPage),
        messages,
        arrCli,
        req
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.view = async (req, res) => {
  try {
    const customer = await billModel.findOne({ _id: req.params.id });

    let arrPro = [];
    let idPro;

    for (let i = 0; i < customer.arr_product.length; i++) {
      idPro = customer.arr_product[i].id_product;

      const product = await productModel.findOne({ _id: idPro });

      arrPro.push(product);
    }


  
      if (customer.paymentMethod != undefined) {
        switch (customer.paymentMethod) {
          case 0:
            customer.paymentMethodText = "COD"
            break;
          case 1:
            customer.paymentMethodText = "Credit Card"
            break;        
          default:
            break;
        }
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

exports.confirmBill = async (req, res, next) => {
  if (req.method == "GET") {
    let { id } = req.params;
    if (id) {
      let bill = await billModel.findById(id);
      if (bill && bill.status == -1) {
        bill.status = 0;
        console.log("Delivering");
        await billModel.findByIdAndUpdate(id, bill);
        res.redirect('/bill');
      }
    }
  }
};

exports.confirmDelivery = async (req, res, next) => {
  if (req.method == "GET") {
    let { id } = req.params;
    if (id) {
      let bill = await billModel.findById(id);
      if (bill && bill.status == 0) {
        bill.status = 1;
        console.log("Delivered");
        await billModel.findByIdAndUpdate(id, bill);
        res.redirect('/bill');
      }
    }
  }
};




exports.listPro = async (req, res, next) => {
  const messages = await req.consumeFlash("info");

  const locals = {
    title: "NodeJs",
    description: "Free NodeJs User Management System",
  };

  let perPage = 5;
  let page = req.query.page || 1;

  try {
    const clients = await billProduct
      .aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
    const count = await billProduct.count();
    // console.log("cus: ", clients);

    let arrPro = [];
    let idPro;
    for (let i = 0; i < clients.length; i++) {
      idPro = clients[i].id_product;

      const product = await productModel.findOne({ _id: idPro });

      arrPro.push(product);

    }

    res.render("billpro/viewBillPro", {
      locals,
      clients,
      current: page,
      pages: Math.ceil(count / perPage),
      messages,
      arrPro,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.listSortPro = async (req, res, next) => {
  const messages = await req.consumeFlash("info");

  let perPage = 5;
  let page = req.query.page || 1;

  try {
    if (req.query.hasOwnProperty("_sort")) {
    
      const clients = await billProduct
        .aggregate()
        .sort({ [req.query.column]: req.query.type })
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();
      const count = await billProduct.count();

      let arrPro = [];
      let idPro;
      for (let i = 0; i < clients.length; i++) {
        idPro = clients[i].id_product;
  
        const product = await productModel.findOne({ _id: idPro });
  
        arrPro.push(product);
  
      }

      res.render("billpro/viewBillPro", {
        clients,
        current: page,
        pages: Math.ceil(count / perPage),
        messages,
        arrPro
      });
    }
  } catch (error) {
    console.log(error);
  }
}


exports.deletePro = async (req, res) => {
  await billProduct.deleteOne({_id: req.params.id})
  res.redirect('/bill/pro');
};

