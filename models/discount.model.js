let db = require('../database/database');
let DiscountSchema = new db.mongoose.Schema(
    {
        value: { type: Number, required: true },
        created_at: { type: Date, required: true },
        expires_at: { type: Date, required: true },
    },
    {
        collection: 'Discounts'
    }
)

let DiscountModel = db.mongoose.model('DiscountModel', DiscountSchema);

module.exports = { DiscountModel };