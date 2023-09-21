let db = require('../database/database');
let BillSchema = new db.mongoose.Schema(
    {
        id_product: { type: db.mongoose.Schema.Types.ObjectId, ref: 'ProductModel' },
        id_client: { type: db.mongoose.Schema.Types.ObjectId, ref: 'ClientModel' },
        quantity: { type: String, required: true },
        price: { type: String, required: true },
        created_at: { type: Date, required: true },
    },
    {
        collection: 'Bills'
    }
)

let BillModel = db.mongoose.model('BillModel', BillSchema);

module.exports = { BillModel };