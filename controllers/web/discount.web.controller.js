let discountModel = require('../../models/discount.model').DiscountModel;

exports.list = async (req, res, next) => {
    const messages = await req.consumeFlash('info');
    const locals = {
      title: 'NodeJs',
      description: 'Free NodeJs User Management System'
    }

    let perPage = 2;
    let page = req.query.page || 1;

    try {
      const clients = await discountModel.aggregate([ { $sort: { createdAt: -1 } } ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec(); 
      const count = await discountModel.count();
      console.log("cus: ",clients);

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


exports.insert = async (req, res, next) => {
    if (req.method == "POST") {
        let { value, started_at, expires_at } = req.body;
        let newDiscount = new discountModel();
        newDiscount.value = value;
        newDiscount.started_at = new Date();
        newDiscount.expires_at = new Date();
        await newDiscount.save();
        return res.send(newDiscount);
    }
    res.send('List')
}