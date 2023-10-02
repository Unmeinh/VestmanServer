let chatbotModel = require('../../models/chatbot.model').ChatbotModel;

exports.list = async (req, res, next) => {
    let arr_chatbot = await chatbotModel.find().populate('id_product');
    res.send(arr_chatbot)
}

exports.insert = async (req, res, next) => {
    if (req.method == "POST") {
        let { id_product, questions, replies } = req.body;
        let newChatbot = new chatbotModel();
        newChatbot.id_product = id_product;
        newChatbot.questions = [
            "Bộ vest này còn hàng không shop?",
            "Tôi muốn biết mình vừa với size bao nhiêu thì phải làm sao?",
            "Bộ vest này còn màu khác không?"
        ]
        newChatbot.replies = replies;
        // [
        //     "Sản phẩm này còn hàng bạn nhé!",
        //     "Mời bạn xem ảnh bên dưới để biết được size phù hợp nhé?\nhttps://theme.hstatic.net/1000333436/1001040510/14/vendor_value_4.jpg?v=141",
        //     "Bạn hãy xem danh sách vest để tìm màu phù hợp với mình nhé!"
        // ]
        newChatbot.created_at = new Date();
        await newChatbot.save();
        return res.send(newChatbot);
    }
    res.send('List')
}