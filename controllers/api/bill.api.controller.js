let billModel = require('../../models/bill.model').BillModel;

exports.list = async (req, res, next) => {
    try {
        let idClient = req.params.idClient;
        if (!idClient) {
            return res.status(200).json({ success: false, data: {}, message: "Không đọc được dữ liệu khách hàng!" });
        }
        let arr_bill = await billModel.find({ id_client: idClient }).populate('arr_product.id_product');
        if (arr_bill) {
            return res.status(200).json({ success: true, data: arr_bill, message: "Lấy danh sách đơn hàng thành công." });
        } else {
            return res.status(200).json({ success: false, data: {}, message: "Không có đơn hàng nào!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, data: {}, message: "Lỗi: " + error.message });
    }
}

exports.insert = async (req, res, next) => {
    try {
        if (req.method == "POST") {
            let idClient = req.params.idClient;
            let { arr_product, total } = req.body;
            if (!idClient) {
                return res.status(200).json({ success: false, data: {}, message: "Không đọc được dữ liệu khách hàng!" });
            }
            if (!req.body) {
                return res.status(500).json({ success: false, data: {}, message: "Không đọc được dữ liệu tải lên! " });
            }
            let newBill = new billModel();
            newBill.id_client = idClient;
            let arr = [];
            for (let i = 0; i < arr_product.length; i++) {
                const product = arr_product[i];
                arr.push(product);
            }
            newBill.arr_product = arr;
            newBill.total = total;
            newBill.status = -1;
            newBill.created_at = new Date();
            await newBill.save();
            return res.status(201).json({ success: true, data: {}, message: "Thêm đơn hàng thành công." });
        }
    } catch (error) {
        return res.status(500).json({ success: false, data: {}, message: "Lỗi: " + error.message });
    }
}

exports.confirmReceive = async (req, res, next) => {
    if (req.method == "PUT") {
      let { id } = req.params;
      if (id) {
        let bill = await billModel.findById(id);
        if (bill && bill.status == 1) {
          bill.status = 2;
          await billModel.findByIdAndUpdate(id, bill);
          return res.status(201).json({ success: true, data: {}, message: "Xác nhận thành công." });
        } else {
            return res.status(201).json({ success: false, data: {}, message: "Đơn hàng này chưa thể xác nhận!" });
        }
      }
    }
  };
  