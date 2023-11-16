let blogModel = require("../../models/blog.model").BlogModel;
let productModel = require("../../models/product.model").ProductModel;
const { onUploadImages } = require("../../function/uploadImage");

exports.list = async (req, res, next) => {
  const messages = await req.consumeFlash("info");

  const locals = {
    title: "NodeJs",
    description: "Free NodeJs User Management System",
  };

  let perPage = 10;
  let page = req.query.page || 1;

  try {
    const clients = await blogModel
      .aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
    const count = await blogModel.count();
    // console.log("cus: ", clients);

    let arrPro = [];
    let idPro;
    for (let i = 0; i < clients.length; i++) {
      idPro = clients[i].id_product;

      const product = await productModel.findOne({ _id: idPro });

      arrPro.push(product);

    }

    res.render("viewBlog", {
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

exports.listSort = async (req, res, next) => {
  const messages = await req.consumeFlash("info");

  let perPage = 10;
  let page = req.query.page || 1;

  try {
    if (req.query.hasOwnProperty("_sort")) {
    
      const clients = await blogModel
        .aggregate()
        .sort({ [req.query.column]: req.query.type })
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();
      const count = await blogModel.count();

      let arrPro = [];
      let idPro;
      for (let i = 0; i < clients.length; i++) {
        idPro = clients[i].id_product;
  
        const product = await productModel.findOne({ _id: idPro });
  
        arrPro.push(product);
  
      }

      res.render("viewBlog", {
        clients,
        current: page,
        pages: Math.ceil(count / perPage),
        messages,
        arrPro,
        req
      });
    }
  } catch (error) {
    console.log(error);
  }
}


exports.view = async (req, res) => {
  try {
    const customer = await blogModel.findOne({ _id: req.params.id });

    const pro = await productModel.findOne({ _id: customer.id_product });

    const locals = {
      title: "View Customer Data",
      description: "Free NodeJs User Management System",
    };

    res.render("blog/detailBlog", {
      locals,
      customer,
      pro,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.insert = async (req, res, next) => {
  if (req.method == "POST") {
    let imageUrl = await onUploadImages(req.files, 'admin');

    let { id_product, description, expires_at } = req.body;
    let newBlog = new blogModel();
    newBlog.id_product = id_product;
    newBlog.description = description;
    newBlog.thumbnailImage = imageUrl[0];
    newBlog.expires_at = expires_at;
    newBlog.created_at = new Date();
    await newBlog.save();
    return res.redirect('/blog');
  }

  let arr_Pro = await productModel.find();
  res.render("blog/addBlog",{
    arr_Pro
  });
};

exports.edit = async (req, res) => {
  try {
    const blog = await blogModel.findById({_id : req.params.id});
    let arr_Pro = await productModel.find();
    let pro = await productModel.findById({_id : blog.id_product})

    res.render("blog/editBlog",{
      blog,
      arr_Pro,
      pro
    })

  } catch (error) {
    console.log(error);
  }
}

exports.editPost = async (req, res) => {
  let { id_product, description, expires_at, expires_at2, thumbnailImage, created_at, _id } = req.body;

  let imageUrl = await onUploadImages(req.files, 'admin');

  if(!imageUrl.length==0){
    thumbnailImage = imageUrl[0];
  }

  if(expires_at2 != ''){
    expires_at = expires_at2;
  }

  await blogModel.findByIdAndUpdate(_id,{
    id_product : id_product,
    description : description,
    thumbnailImage: thumbnailImage,
    expires_at : expires_at,
    created_at : created_at,
  });

  res.redirect('/blog');

}
exports.delete = async (req, res, next) => {
  await blogModel.deleteOne({_id: req.params.id})
  res.redirect('/blog');
}

