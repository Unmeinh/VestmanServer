let db = require('../database/database');
let ChatbotSchema = new db.mongoose.Schema(
    {
        id_product: { type: db.mongoose.Schema.Types.ObjectId, ref: 'ProductModel' },
        questions: { type: Array, required: true },
        replies: { type: Array, required: true },
        created_at: { type: Date, required: true },
    },
    {
        collection: 'Chatbots'
    }
)

let ChatbotModel = db.mongoose.model('ChatbotModel', ChatbotSchema);

module.exports = { ChatbotModel };