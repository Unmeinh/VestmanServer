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
exports.listSort = async (req, res, next) => {

  const messages = await req.consumeFlash('info');


  let perPage = 5;
  let page = req.query.page || 1;

  try {
    const clients = await productModel.aggregate()
      .sort({price: 1})
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec(); 
    const count = await productModel.count();

    res.render('viewProduct', {
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


  let perPage = 5;
  let page = req.query.page || 1;

  try {
    const clients = await productModel.aggregate()
      .sort({price: -1})
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec(); 
    const count = await productModel.count();

    res.render('viewProduct', {
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


// let sizes = [];
// let name_product ='', quantity='', price='';
// exports.insertSizes = async (req, res, next) => {

//       name_product = req.body.name_product;
//       id_discount = req.body.id_discount;
//       quantity = req.body.quantity;
//       price = req.body.price;

//       let size = req.body.newItem;
//       if(!size == "")
//       sizes.push(size);


//   let arr_dis = await discountModel.find();
//   res.render('product/testPro',{
//     arr_dis,
//     sizes,
//     name_product, quantity, price
//   })
// }

exports.insert = async (req, res, next) => {
    if (req.method == "POST") {

      let imageUrl = await onUploadImages(req.files, 'admin');

      // let size = req.body.newItem;
      // if(!size == "")
      // sizes.push(size);

        let sizes = []
        let str = req.body.size;
        sizes = str.split(',');

        let { name_product, detail_product, id_discount, color, quantity, price } = req.body;
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
    // name_product ='', quantity='', price='', sizes=[];
    // res.render('product/testPro',{
    //   arr_dis,
    //   sizes,
    //   name_product, quantity, price
    // })
    res.render('product/addPro',{
      arr_dis
    })
}


exports.edit = async(req, res) =>{
  
  try {
    const Pro = await productModel.findById({_id : req.params.id});
    let arr_dis = await discountModel.find();
    let dis = await discountModel.findById({_id : Pro.id_discount})

    res.render("product/editPro",{
      Pro,
      arr_dis,
      dis
    })

  } catch (error) {
    console.log(error);
  }

}

exports.editPost = async(req, res) =>{

    let {name_product, detail_product, id_discount, color, quantity, price, images, created_at, _id} = req.body;

    const imageUrl = await onUploadImages(req.files, 'admin');

    if(!imageUrl.length==0){
      images = imageUrl
    }

    let sizes = []
    let str = req.body.size;
    sizes = str.split(',');

    await productModel.findByIdAndUpdate(_id,{
      name_product : name_product,
      detail_product : detail_product,
      id_discount : id_discount,
      sizes : sizes,
      color : color,
      quantity : quantity,
      quantitySold : 0,
      price : price,
      images : images,
      created_at : created_at,
    });

    res.redirect('/product');
}

exports.delete = async(req, res) =>{
  await productModel.deleteOne({_id: req.params.id})
  res.redirect('/product');
}

