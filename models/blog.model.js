let db = require('../database/database');
let BlogSchema = new db.mongoose.Schema(
    {
        id_product: { type: db.mongoose.Schema.Types.ObjectId, ref: 'ProductModel' },
        description: { type: String, required: true },
        expires_at: { type: Date, required: true },
        created_at: { type: Date, required: true },
    },
    {
        collection: 'Blogs'
    }
)

let BlogModel = db.mongoose.model('BlogModel', BlogSchema);

module.exports = { BlogModel };