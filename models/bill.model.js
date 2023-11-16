let db = require('../database/database');
let BillSchema = new db.mongoose.Schema(
    {
        id_client: { type: db.mongoose.Schema.Types.ObjectId, ref: 'ClientModel' },
        arr_product: [
            {
                id_product: { type: db.mongoose.Schema.Types.ObjectId, ref: 'ProductModel' },
                price: { type: Number, required: true },
                size: { type: String, required: true },
                quantity: { type: Number, required: true },
            }
        ],
        total: { type: Number, required: true },
        customerInfo: { type: Object, required: true },
        paymentMethod: { type: Number, required: true },
        status: { type: Number, required: true },
        created_at: { type: Date, required: true },

        
        status:{type:Number,default:-1},
    },
    {
        collection: 'Bills'
    }
)

let BillModel = db.mongoose.model('BillModel', BillSchema);

module.exports = { BillModel };