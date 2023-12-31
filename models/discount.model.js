let db = require('../database/database');
let DiscountSchema = new db.mongoose.Schema(
    {
        value: { type: Number, required: true },
        started_at: { type: Date, required: true },
        expires_at: { type: Date, required: true },
    },
    {
        collection: 'Discounts'
    }
)
DiscountSchema.index( { "expires_at": 1 }, { expireAfterSeconds: 0 } );
let DiscountModel = db.mongoose.model('DiscountModel', DiscountSchema);

module.exports = { DiscountModel };