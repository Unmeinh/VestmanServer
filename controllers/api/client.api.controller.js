const { onGenerateRandomString } = require('../../function/functionName');
const { onUploadImages } = require("../../function/uploadImage");
let clientModel = require('../../models/client.model').ClientModel;

exports.list = async (req, res, next) => {
    try {
        let arr_client = await clientModel.find();
        if (arr_client) {
            return res.status(200).json({ success: true, data: arr_client, message: "Lấy danh sách sản phẩm thành công." });
        } else {
            return res.status(200).json({ success: false, data: {}, message: "Không có sản phẩm nào!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, data: {}, message: "Lỗi: " + error.message });
    }
}

exports.register = async (req, res, next) => {
    try {
        if (req.method == "POST") {
            let { username, password, email } = req.body;
            if (!req.body) {
                return res.status(500).json({ success: false, data: {}, message: "Không đọc được dữ liệu tải lên! " });
            }
            let newClient = new clientModel();
            newClient.username = username;
            newClient.password = password;
            newClient.email = email;
            newClient.full_name = "Client-" + onGenerateRandomString(5);
            newClient.phone_number = "Not yet";
            newClient.address = "Not yet set up";
            newClient.created_at = new Date();
            newClient.avatar = "https://firebasestorage.googleapis.com/v0/b/vestman-firebase-ada53.appspot.com/o/images%2Favatar%2Fclient%2Fclient-default.png?alt=media&token=b7db5aa3-5027-4724-a415-9a3e606c40d1";
            await newClient.save();
            return res.status(201).json({ success: true, data: {}, message: "Đăng ký tài khoản thành công." });
        }
    } catch (error) {
        return res.status(500).json({ success: false, data: {}, message: "Lỗi: " + error.message });
    }
}

exports.login = async (req, res, next) => {
    if (req.method == "POST") {
        try {
            let { username, password } = req.body;
            if (!req.body) {
                return res.status(500).json({ success: false, data: {}, message: "Không đọc được dữ liệu tải lên! " });
            }
            let objU = await clientModel.findOne({ username: username });
            if (!objU) {
                return res.status(201).json({ success: false, message: "Không tìm thấy tài khoản với email trên!" });
            }
            if (!String(objU.password) == String(password)) {
                return res.status(201).json({ success: false, message: "Sai mật khẩu!" });
            }
            return res.status(201).json({ success: true, data: objU, message: "Đăng nhập thành công." });
        } catch (error) {
            console.error("Lỗi: " + error.message);
            return res.status(500).json({ success: false, data: {}, message: "Lỗi: " + error.message });
        }
    }
};

exports.updateClient = async (req, res, next) => {
    if (req.method == "PUT") {
        let idClient = req.params.idClient;
        let { full_name, phone_number, email, address } = req.body;
        if (req.body && idClient) {
            try {
                let objU = await clientModel.findById(idClient);
                if (!objU) {
                    return res.status(201).json({ success: false, message: "Không tìm thấy tài khoản!" });
                }
                objU.full_name = full_name;
                objU.phone_number = phone_number;
                objU.address = address;
                objU.email = email;
                await clientModel.findByIdAndUpdate(objU._id, objU);
                return res.status(201).json({ success: true, data: objU, message: "Cập nhật dữ liệu thành công " });
            } catch (error) {
                return res.status(500).json({ success: false, data: {}, message: "Lỗi: " + error.message });
            }
        } else {
            return res.status(500).json({ success: false, data: {}, message: "Không đọc được dữ liệu tải lên! " });
        }
    }
};

exports.updateAvatar = async (req, res, next) => {
    if (req.method == "PUT") {
        try {
            let idClient = req.params.idClient;
            let { imageUrl } = req.body;
            if (idClient) {
                let objU = await clientModel.findById(idClient);
                if (!objU) {
                    return res.status(201).json({ success: false, message: "Không tìm thấy tài khoản!" });
                }
                let imageUrl = await onUploadImages(req.files, 'admin');
                if (imageUrl == []) {
                    objU.avatar = "";
                } else {
                    objU.avatar = imageUrl[0];
                }
                await clientModel.findByIdAndUpdate(objU._id, objU)
                return res.status(201).json({ success: true, data: objU, message: "Cập nhật ảnh đại diện thành công." });
            } else {
                return res.status(201).json({ success: false, data: {}, message: "Không có ảnh tải lên!" });
            }
        } catch (error) {
            return res.status(500).json({ success: false, data: {}, message: "Lỗi: " + error.message });
        }
    }
};

exports.updatePassword = async (req, res, next) => {
    if (req.method == "PUT") {
        let idClient = req.params.idClient;
        let { password } = req.body;
        if (req.body && idClient) {
            let objU = await clientModel.findById(idClient);
            if (!objU) {
                return res.status(201).json({ success: false, message: "Không tìm thấy tài khoản!" });
            }
            objU.password = password;
            await clientModel.findByIdAndUpdate(objU._id, objU)
            return res.status(201).json({ success: true, data: objU, message: "Đổi mật khẩu thành công." });
        } else {
            return res.status(500).json({ success: false, data: {}, message: "Đổi mật khẩu thất bại, không nhận được dữ liệu mật khẩu mới! " });
        }
    }
};
