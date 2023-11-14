let productModel = require("../../models/product.model").ProductModel;
let discountModel = require("../../models/discount.model").DiscountModel;


exports.list = async (req, res, next) => {
  try {
    let arr_product = await productModel.find().populate("id_discount");
    let productMo = {};
    productMo.id_discount = "650c2af9cba06c726388496a";

    for (let i = 0; i < arr_product.length; i++) {
      const discount = await discountModel.findOne({
        _id: arr_product[i].id_discount,
      });
      if (!discount) {
        await productModel.findByIdAndUpdate(arr_product[i]._id, productMo);
      }
    }

    if (arr_product) {
      return res
        .status(200)
        .json({
          success: true,
          data: arr_product,
          message: "Lấy danh sách sản phẩm thành công.",
        });
    } else {
      return res
        .status(200)
        .json({ success: false, data: {}, message: "Không có sản phẩm nào!" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, data: {}, message: "Lỗi: " + error.message });
  }
};
