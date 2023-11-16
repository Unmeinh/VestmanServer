let discountModel = require('../../models/discount.model').DiscountModel;

exports.list = async (req, res, next) => {
    const messages = await req.consumeFlash('info');
    const locals = {
      title: 'NodeJs',
      description: 'Free NodeJs User Management System'
    }

    let perPage = 11;
    let page = req.query.page || 1;

    try {
      const clients = await discountModel.aggregate()
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec(); 
      const count = await discountModel.count();


      clients.shift();
      res.render('viewDiscount', {
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
  const messages = await req.consumeFlash("info");

  let perPage = 11;
  let page = req.query.page || 1;

  try {
    if (req.query.hasOwnProperty("_sort")) {
    
      const clients = await discountModel
        .aggregate()
        .sort({ [req.query.column]: req.query.type })
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();
      const count = await discountModel.count();

      if(req.query.type == "desc"){
        clients.pop();
      }else{
        clients.shift();
      }
      
      res.render("viewDiscount", {
        clients,
        current: page,
        pages: Math.ceil(count / perPage),
        messages,
        req
      });
    }
  } catch (error) {
    console.log(error);
  }
}


exports.insert = async (req, res, next) => {
  console.log('ok');

    if (req.method == "POST") {
        let { value, started_at, expires_at } = req.body;
        let newDiscount = new discountModel();
        newDiscount.value = value;
        newDiscount.started_at = new Date();
        newDiscount.expires_at = expires_at;
        await newDiscount.save();
        return res.redirect('/discount');
    }
    res.render('discount/addDis');
}

exports.edit = async (req, res, next) => {
  try {
    const dis = await discountModel.findById({_id : req.params.id});
   
    res.render("discount/editDis",{
      dis
    })

  } catch (error) {
    console.log(error);
  }
}

exports.editPost = async (req, res, next) => {
  let { value, started_at, expires_at, expires_at2, _id } = req.body;


  if(expires_at2 != ''){
    expires_at = expires_at2;
  }

  await discountModel.findByIdAndUpdate(_id,{
    value : value,
    started_at : started_at,
    expires_at : expires_at
  });

  res.redirect('/discount');

}
exports.delete = async (req, res, next) => {
  await discountModel.deleteOne({_id: req.params.id})
  res.redirect('/discount');
}
