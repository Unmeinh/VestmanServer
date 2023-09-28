let productModel = require('../../models/product.model').ProductModel;

exports.list = async (req, res, next) => {
    let arr_product = await productModel.find().populate('id_discount');
    res.send(arr_product)
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
        newProduct.quantitySold = 0;
        newProduct.price = price;
        newProduct.created_at = new Date();
        newProduct.images = [];
        await newProduct.save();
        return res.send(newProduct);
    }
    res.send('List')
}