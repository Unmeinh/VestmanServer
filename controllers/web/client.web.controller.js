let clientModel = require('../../models/client.model').ClientModel;

exports.list = async (req, res, next) => {
    let arr_client = await clientModel.find();
    res.send(arr_client)
}

exports.insert = async (req, res, next) => {
    if (req.method == "POST") {
        let { username, password, email, full_name, phone_number, address } = req.body;
        let newClient = new clientModel();
        newClient.username = username;
        newClient.password = password;
        newClient.full_name = full_name;
        newClient.email = email;
        newClient.phone_number = phone_number;
        newClient.address = address;
        newClient.created_at = new Date();
        newClient.avatar = "https://png.pngtree.com/png-vector/20190822/ourmid/pngtree-avatar-client-face-happy-man-person-user-business-flat-li-png-image_1695892.jpg";
        await newClient.save();
        return res.send(newClient);
    }
    res.send('List')
}