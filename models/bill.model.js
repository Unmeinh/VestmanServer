let db = require('../database/database');
let BillSchema = new db.mongoose.Schema(
    {
        id_client: { type: db.mongoose.Schema.Types.ObjectId, ref: 'ClientModel' },
        arr_product: [
            {
                id_product: { type: db.mongoose.Schema.Types.ObjectId, ref: 'ProductModel' },
                size: { type: String, required: true },
                quantity: { type: String, required: true },
            }
        ],
        total: { type: Number, required: true },
        created_at: { type: Date, required: true },
    },
    {
        collection: 'Bills'
    }
)

let BillModel = db.mongoose.model('BillModel', BillSchema);

module.exports = { BillModel };