let productModel = require('../../models/product.model').ProductModel;
let discountModel = require('../../models/discount.model').DiscountModel;
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
    const discount = await discountModel.findOne({ _id: customer.id_discount })

    const locals = {
      title: "View Customer Data",
      description: "Free NodeJs User Management System",
    };

    res.render('product/detailPro', {
      locals,
      customer,
      discount
    })

  } catch (error) {
    console.log(error);
  }

}  

exports.insert = async (req, res, next) => {
    if (req.method == "POST") {

      let imageUrl = await onUploadImages(req.files, 'admin');


        let { name_product, detail_product, id_discount, sizes, color, quantity, price } = req.body;
        let newProduct = new productModel();
        newProduct.name_product = name_product;
        newProduct.detail_product = detail_product;
        newProduct.id_discount = id_discount;
        newProduct.sizes = sizes;
        newProduct.color = color;
        newProduct.quantity = quantity;
        newProduct.quantitySold = 0;
        newProduct.price = price;
        newProduct.created_at = new Date();
        newProduct.images = imageUrl;
        await newProduct.save();
        return res.redirect('/product');
    }

    let arr_dis = await discountModel.find();
    res.render('product/addPro',{
      arr_dis
    })
}