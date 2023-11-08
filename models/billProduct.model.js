let db = require('../database/database');
let BillSchema2 = new db.mongoose.Schema(
    {
        id_product: { type: db.mongoose.Schema.Types.ObjectId, ref: 'ProductModel' },
        amount: { type: Number, required: true },
        total: { type: Number, required: true },
        created_at: { type: Date, default: Date.now},
    },
    {
        collection: 'BillsProduct'
    }
)

let BillProduct = db.mongoose.model('BillProduct', BillSchema2);

module.exports = { BillProduct };