let discountModel = require('../../models/discount.model').DiscountModel;

exports.list = async (req, res, next) => {
    let arr_discount = await discountModel.find();
    res.send(arr_discount)
}

exports.insert = async (req, res, next) => {
    if (req.method == "POST") {
        let { value, started_at, expires_at } = req.body;
        let newDiscount = new discountModel();
        newDiscount.value = value;
        newDiscount.started_at = started_at;
        newDiscount.expires_at = expires_at;
        await newDiscount.save();
        return res.send(newDiscount);
    }
    res.send('List')
}