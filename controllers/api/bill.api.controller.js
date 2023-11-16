let billModel = require('../../models/bill.model').BillModel;
let cartModel = require('../../models/cart.model').CartModel;
let productModel = require('../../models/product.model').ProductModel;

exports.list = async (req, res, next) => {
    try {
        let idClient = req.params.idClient;
        if (!idClient) {
            return res.status(200).json({ success: false, data: {}, message: "Không đọc được dữ liệu khách hàng!" });
        }
        let arr_bill = await billModel.find({ id_client: idClient }).populate('arr_product.id_product');
        if (arr_bill) {
            return res.status(200).json({ success: true, data: arr_bill, message: "Lấy danh sách đơn hàng thành công." });
        } else {
            return res.status(200).json({ success: false, data: {}, message: "Không có đơn hàng nào!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, data: {}, message: "Lỗi: " + error.message });
    }
}

exports.listIncomplete = async (req, res, next) => {
    try {
        let idClient = req.params.idClient;
        if (!idClient) {
            return res.status(200).json({ success: false, data: {}, message: "Không đọc được dữ liệu khách hàng!" });
        }
        let arr_bill = await billModel.find({ id_client: idClient, status: { $lt: 2 } }).populate('arr_product.id_product');
        if (arr_bill) {
            return res.status(200).json({ success: true, data: arr_bill, message: "Lấy danh sách đơn hàng thành công." });
        } else {
            return res.status(200).json({ success: false, data: {}, message: "Không có đơn hàng nào!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, data: {}, message: "Lỗi: " + error.message });
    }
}

exports.listComplete = async (req, res, next) => {
    try {
        let idClient = req.params.idClient;
        if (!idClient) {
            return res.status(200).json({ success: false, data: {}, message: "Không đọc được dữ liệu khách hàng!" });
        }
        let arr_bill = await billModel.find({ id_client: idClient, status: 2 }).populate('arr_product.id_product');
        if (arr_bill) {
            return res.status(200).json({ success: true, data: arr_bill, message: "Lấy danh sách đơn hàng thành công." });
        } else {
            return res.status(200).json({ success: false, data: {}, message: "Không có đơn hàng nào!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, data: {}, message: "Lỗi: " + error.message });
    }
}

exports.insert = async (req, res, next) => {
    try {
        if (req.method == "POST") {
            let idClient = req.params.idClient;
            let { customerInfo, paymentMethod, total } = req.body;
            if (!idClient) {
                return res.status(201).json({ success: false, data: {}, message: "Không đọc được dữ liệu khách hàng!" });
            }
            if (!req.body) {
                return res.status(500).json({ success: false, data: {}, message: "Không đọc được dữ liệu tải lên! " });
            }
            let listCart = await cartModel.find({ id_client: idClient }).populate('id_product');
            if (listCart) {
                if (listCart.length > 0) {
                    let newBill = new billModel();
                    newBill.id_client = idClient;
                    let arr = [];
                    for (let i = 0; i < listCart.length; i++) {
                        const cart = listCart[i];
                        arr.push(
                            {
                                id_product: cart?.id_product?._id,
                                price: cart?.id_product?.price,
                                size: cart?.size,
                                quantity: cart?.quantity
                            }
                        );
                        let product = await productModel.findById(cart?.id_product?._id);
                        let newProduct = product.toObject();
                        if (Number(newProduct.quantity) < Number(cart.quantity)) {
                            return res.status(201).json({ success: false, data: {}, message: "Sản phẩm " + newProduct.name_product + " không còn đủ hàng!" });
                        } 
                        newProduct.quantity = Number(newProduct.quantity) - Number(cart.quantity);
                        newProduct.quantitySold = Number(newProduct.quantitySold) + Number(cart.quantity);
                        await productModel.findByIdAndUpdate(newProduct?._id, newProduct);
                    }
                    newBill.arr_product = arr;
                    newBill.customerInfo = customerInfo;
                    newBill.paymentMethod = paymentMethod;
                    newBill.total = total;
                    newBill.status = -1;
                    newBill.created_at = new Date();
                    await newBill.save();
                    await cartModel.deleteMany({id_client: idClient});
                    return res.status(201).json({ success: true, data: {}, message: "Thêm đơn hàng thành công." });
                } else {
                    return res.status(201).json({ success: false, data: {}, message: "Giỏ hàng đang trống!" });
                }
            } else {
                return res.status(201).json({ success: false, data: {}, message: "Không tìm thấy danh sách giỏ hàng!" });
            }
        }
    } catch (error) {
        return res.status(500).json({ success: false, data: {}, message: "Lỗi: " + error.message });
    }
}

exports.confirmReceive = async (req, res, next) => {
    if (req.method == "PUT") {
        let { idBill } = req.params;
        if (idBill) {
            let bill = await billModel.findById(idBill);
            if (bill && bill.status == 1) {
                bill.status = 2;
                await billModel.findByIdAndUpdate(idBill, bill);
                return res.status(201).json({ success: true, data: {}, message: "Xác nhận thành công." });
            } else {
                return res.status(201).json({ success: false, data: {}, message: "Đơn hàng này chưa thể xác nhận!" });
            }
        }
    }
};
