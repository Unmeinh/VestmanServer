let db = require('../database/database');
let AdminSchema = new db.mongoose.Schema(
    {
        username: { type: String, required: true, index: { unique: true } },
        password: { type: String, required: true },
        permission: { type: String, required: true },
        created_at: { type: Date, required: true },
        avatar: { type: String, required: false },
    },
    {
        collection: 'Admins'
    }
)

let AdminModel = db.mongoose.model('AdminModel', AdminSchema);

module.exports = { AdminModel };