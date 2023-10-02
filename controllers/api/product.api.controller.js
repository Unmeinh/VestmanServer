let productModel = require('../../models/product.model').ProductModel;

exports.list = async (req, res, next) => {
    try {
        let arr_product = await productModel.find().populate('id_discount');
        if (arr_product) {
            return res.status(200).json({ success: true, data: arr_product, message: "Lấy danh sách sản phẩm thành công." });
        } else {
            return res.status(200).json({ success: false, data: {}, message: "Không có sản phẩm nào!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, data: {}, message: "Lỗi: " + error.message });
    }
}