let db = require('../database/database');
let ProductSchema = new db.mongoose.Schema(
    {
        name_product: { type: String, required: true },
        detail_product: { type: String, required: true },
        id_discount: { type: db.mongoose.Schema.Types.ObjectId, ref: 'DiscountModel' },
        sizes: { type: Array, required: true },
        color: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        quantitySold: { type: Number, required: true },
        images: { type: Array, required: true },
        created_at: { type: Date, required: true },
    },
    {
        collection: 'Products'
    }
)

let ProductModel = db.mongoose.model('ProductModel', ProductSchema);

module.exports = { ProductModel };