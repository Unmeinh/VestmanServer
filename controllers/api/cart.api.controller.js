let cartModel = require('../../models/cart.model').CartModel;
let productModel = require('../../models/product.model').ProductModel;

exports.list = async (req, res, next) => {
    try {
        let idClient = req.params.idClient;
        if (!idClient) {
            return res.status(200).json({ success: false, data: {}, message: "Không đọc được dữ liệu khách hàng!" });
        }
        let arr_cart = await cartModel.find({ id_client: idClient }).populate('id_product');
        if (arr_cart) {
            return res.status(200).json({ success: true, data: arr_cart, message: "Lấy danh sách giỏ hàng thành công." });
        } else {
            return res.status(200).json({ success: false, data: {}, message: "Giỏ hàng trống!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, data: {}, message: "Lỗi: " + error.message });
    }
}

exports.insertCart = async (req, res, next) => {
    try {
        if (req.method == "POST") {
            let idClient = req.params.idClient;
            let { id_product, quantity, size } = req.body;
            if (!idClient) {
                return res.status(200).json({ success: false, data: {}, message: "Không đọc được dữ liệu khách hàng!" });
            }
            if (!req.body) {
                return res.status(500).json({ success: false, data: {}, message: "Không đọc được dữ liệu tải lên! " });
            }
            let cart = await cartModel.findOne({ id_client: idClient, id_product: id_product })
            if (cart) {
                await updateProduct(cart.id_product, quantity, res);
                cart.quantity = Number(cart.quantity) + Number(quantity);
                cart.size = size;
                await cartModel.findByIdAndUpdate(cart._id, cart);
                return res.status(201).json({ success: true, data: {}, message: "Thêm vào giỏ hàng thành công." });
            } else {
                let newCart = new cartModel();
                newCart.id_client = idClient;
                newCart.id_product = id_product;
                newCart.quantity = quantity;
                newCart.size = size;
                newCart.created_at = new Date();
                await updateProduct(id_product, quantity, res);
                await newCart.save();
                return res.status(201).json({ success: true, data: {}, message: "Thêm vào giỏ hàng thành công." });
            }
        }
    } catch (error) {
        // return res.status(500).json({ success: false, data: {}, message: "Lỗi: " + error.message });
    }
}

exports.updateCart = async (req, res, next) => {
    try {
        if (req.method == "PUT") {
            let idCart = req.params.idCart;
            let { quantity, size } = req.body;
            if (!idCart) {
                return res.status(200).json({ success: false, data: {}, message: "Không đọc được dữ liệu giỏ hàng!" });
            }
            if (!req.body) {
                return res.status(500).json({ success: false, data: {}, message: "Không đọc được dữ liệu tải lên! " });
            }
            let cart = await cartModel.findById(idCart).populate('id_product')
            cart.quantity = quantity;
            cart.size = size;
            await updateProduct(cart.id_product, quantity);
            await cartModel.findByIdAndUpdate(cart_id, cart);
            return res.status(201).json({ success: true, data: {}, message: "Cập nhật giỏ hàng thành công." });
        }
    } catch (error) {
        // return res.status(500).json({ success: false, data: {}, message: "Lỗi: " + error.message });
    }
}

exports.deleteCart = async (req, res, next) => {
    try {
        if (req.method == "DELETE") {
            let idCart = req.params.idCart;
            if (!idCart) {
                return res.status(200).json({ success: false, data: {}, message: "Không đọc được dữ liệu giỏ hàng!" });
            }
            await cartModel.findByIdAndDelete(idCart)
            return res.status(203).json({ success: true, data: {}, message: "Xóa khỏi giỏ hàng thành công." });
        }
    } catch (error) {
        return res.status(500).json({ success: false, data: {}, message: "Lỗi: " + error.message });
    }
}

async function updateProduct(id_product, cartQuantity, res) {
    let product = await productModel.findById(id_product);
    if (product) {
        if (product.quantity > 0) {
            if (product.quantity < cartQuantity) {
                return res.status(201).json({ success: false, data: {}, message: "Số lượng hàng còn không đủ!" });
            }
        } else {
            return res.status(201).json({ success: false, data: {}, message: "Sản phẩm đã hết hàng!" });
        }
    } else {
        return res.status(500).json({ success: false, data: {}, message: "Không tìm thấy sản phẩm!" });
    }
}