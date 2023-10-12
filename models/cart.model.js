let db = require('../database/database');
let CartSchema = new db.mongoose.Schema(
    {
        id_product: { type: db.mongoose.Schema.Types.ObjectId, ref: 'ProductModel' },
        id_client: { type: db.mongoose.Schema.Types.ObjectId, ref: 'ClientModel' },
        quantity: { type: Number, required: true },
        size: { type: String, required: true },
        created_at: { type: Date, required: true },
    },
    {
        collection: 'Carts'
    }
)

let CartModel = db.mongoose.model('CartModel', CartSchema);

module.exports = { CartModel };