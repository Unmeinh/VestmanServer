let blogModel = require('../../models/blog.model').BlogModel;

exports.list = async (req, res, next) => {
    try {
        let arr_blog = await blogModel.find().populate('id_discount');
        if (arr_blog) {
            return res.status(200).json({ success: true, data: arr_blog, message: "Lấy danh sách blog thành công." });
        } else {
            return res.status(200).json({ success: false, data: {}, message: "Không có blog nào!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, data: {}, message: "Lỗi: " + error.message });
    }
}