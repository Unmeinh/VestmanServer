let productModel = require('../../models/product.model').ProductModel;

exports.list = async (req, res, next) => {
    const messages = await req.consumeFlash('info');
    const locals = {
      title: 'NodeJs',
      description: 'Free NodeJs User Management System'
    }

    let perPage = 2;
    let page = req.query.page || 1;

    try {
      const clients = await productModel.aggregate([ { $sort: { createdAt: -1 } } ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec(); 
      const count = await productModel.count();
      console.log("cus: ",clients);

      res.render('viewProduct', {
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
    const customer = await productModel.findOne({ _id: req.params.id })

    const locals = {
      title: "View Customer Data",
      description: "Free NodeJs User Management System",
    };

    res.render('product/detailPro', {
      locals,
      customer
    })

  } catch (error) {
    console.log(error);
  }

}

exports.insert = async (req, res, next) => {
    if (req.method == "POST") {
        let { name_product, detail_product, id_discount, sizes, color, quantity, price } = req.body;
        let newProduct = new productModel();
        newProduct.name_product = name_product;
        newProduct.detail_product = detail_product;
        newProduct.id_discount = id_discount;
        newProduct.sizes = sizes;
        newProduct.color = color;
        newProduct.quantity = quantity;
        newProduct.price = price;
        newProduct.created_at = new Date();
        newProduct.images = [];
        await newProduct.save();
        return res.send(newProduct);
    }
    res.send('List')
}