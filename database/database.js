const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://admin:Abc123@cluster0.purxtfc.mongodb.net/VestmanDB?retryWrites=true&w=majorit',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        writeConcern: { w: 'majority' },
    })
    .then(() => {
        console.log('[mongodb] Kết nối với CSDL Vestman thành công.');
    })
    .catch((err) => {
        console.log(err.message);
        console.log('Lỗi kết nối CSDL!');
    })
module.exports = { mongoose };