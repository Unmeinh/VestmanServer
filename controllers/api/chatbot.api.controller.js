let chatbotModel = require('../../models/chatbot.model').ChatbotModel;

exports.getChatbot = async (req, res, next) => {
    try {
        let idProduct = req.params.idProduct;
        if (idProduct) {
            let objChat = await chatbotModel.findOne({ id_product: idProduct }).populate('id_product');
            if (!objChat) {
                return res.status(200).json({ success: false, message: "Không tìm thấy sản phẩm!" });
            }
            return res.status(200).json({ success: true, data: objChat, message: "Lấy chat bot thành công." });
        } else {
            return res.status(200).json({ success: false, data: {}, message: "Không đọc được dữ liệu sản phẩm!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, data: {}, message: "Lỗi: " + error.message });
    }
}