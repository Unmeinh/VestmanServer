let adminModel = require('../../models/admin.model').AdminModel;

exports.register = async (req, res, next) => {
    if (req.method == "POST") {
        let { username, password, permission } = req.body;
        let newAdmin = new adminModel();
        newAdmin.username = username;
        newAdmin.password = password;
        newAdmin.permission = permission;
        newAdmin.created_at = new Date();
        newAdmin.avatar = "https://firebasestorage.googleapis.com/v0/b/vestman-firebase-ada53.appspot.com/o/images%2Favatar%2Fadmin%2Fadminvest.jpg?alt=media&token=ca361115-f919-44df-86fe-e8c930bbe10d";
        await newAdmin.save();
    }
    res.send('List')
}