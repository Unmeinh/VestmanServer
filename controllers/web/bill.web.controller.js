let billModel = require('../../models/bill.model').BillModel;

exports.list = async (req, res, next) => {
    let arr_bill = await billModel.find().populate(['id_client', 'arr_product.id_product']);
    res.send(arr_bill)
}

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
                quantity: cart.quantity
            })
        }
        newBill.total = total;
        newBill.created_at = new Date();
        await newBill.save();
        return res.send(newBill);
    }
    res.send('List')
}