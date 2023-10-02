let db = require('../database/database');
let ClientSchema = new db.mongoose.Schema(
    {
        username: { type: String, required: true, index: { unique: true } },
        password: { type: String, required: true },
        email: { type: String, required: true, index: { unique: true } },
        phone_number: { type: Number, required: true, index: { unique: true } },
        full_name: { type: String, required: true },
        address: { type: String, required: true },
        created_at: { type: Date, required: true },
        avatar: { type: String, required: false },
    },
    {
        collection: 'Clients'
    }
)

let ClientModel = db.mongoose.model('ClientModel', ClientSchema);

module.exports = { ClientModel };