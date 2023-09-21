const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://vestadmin:7mnmkvo1ALUpo8lW@cluster0.hrig0fm.mongodb.net/?retryWrites=true&w=majority')
.then(()=>{
    console.log('[mongodb] Kết nối với CSDL Vestman thành công.');
})
.catch((err)=>{
    console.log(err.message);
    console.log('Lỗi kết nối CSDL!');
})
module.exports={mongoose};