let adminModel = require('../../models/admin.model').AdminModel;
let productModel = require('../../models/product.model').ProductModel;
let billModel = require('../../models/bill.model').BillModel;
const { onUploadImages } = require('../../function/uploadImage');

exports.list = async (req, res, next) => {
  const messages = await req.consumeFlash('info');
  const locals = {
    title: 'NodeJs',
    description: 'Free NodeJs User Management System'
  }

  let perPage = 2;
  let page = req.query.page || 1;

  try {
    const clients = await adminModel.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
    const count = await adminModel.count();
    console.log("cus: ", clients);

    res.render('viewAdmin', {
      locals,
      clients,
      current: page,
      pages: Math.ceil(count / perPage),
      messages
    });

  } catch (error) {
    console.log(error);
  }
}

exports.view = async (req, res) => {

  try {
    const customer = await adminModel.findOne({ _id: req.params.id })

    const locals = {
      title: "View Customer Data",
      description: "Free NodeJs User Management System",
    };

    res.render('admin/detailAdm', {
      locals,
      customer
    })

  } catch (error) {
    console.log(error);
  }

}

exports.register = async (req, res, next) => {
  if (req.method == "POST") {
    let { username, password, permission, full_name } = req.body;
    let newAdmin = new adminModel();
    newAdmin.username = username;
    newAdmin.password = password;
    newAdmin.full_name = full_name;
    newAdmin.permission = permission;
    newAdmin.created_at = new Date();
    newAdmin.avatar = "https://firebasestorage.googleapis.com/v0/b/vestman-firebase-ada53.appspot.com/o/images%2Favatar%2Fadmin%2Fadminvest.jpg?alt=media&token=ca361115-f919-44df-86fe-e8c930bbe10d";
    await newAdmin.save();
    return res.send(newAdmin);
  }
  res.send('List')
}

exports.statistical = async (req, res, next) => {
  let lastYear = new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().slice(0, 10);
  let listBillByYear = await billModel.find({ created_at: { $gte: lastYear } });
  let listProduct = await productModel.find().sort({ quantitySold: -1 }).limit(5);
  const months = [];
  const endDate = new Date();
  const last6Month = new Date(endDate.getFullYear(), endDate.getMonth() - 5, 1);
  let currentDate = new Date(last6Month);

  while (currentDate <= endDate) {
    let backDate = currentDate.toISOString();
    let nowDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1).toISOString();
    months.push(currentDate.toLocaleString('default', { month: '2-digit', year: 'numeric' }));
    currentDate.setMonth(currentDate.getMonth() + 1);
    let sum = await billModel.aggregate([
      {
        $match: {
          $and: [
            { created_at: { $gte: backDate } },
            { created_at: { $lte: nowDate } }
          ]
        }
      },
      { $group: { _id: null, sum: { $sum: "$total" } } },
      { $project: { _id: 0, total: '$sum' } }
    ]);
    console.log(sum);
  }
  res.render('admin/statisticalAdm', { title: 'Statistical', listProduct: JSON.stringify(listProduct) })
}
exports.login = async (req, res, next) => {

  let msg = '';
  
  if (req.method == 'POST') {
      // lay thong tin dang nhap
      try {
          let objU = await adminModel.findOne({ username: req.body.username });
          console.log(objU);
          
          if (objU != null) {
              // ton taij user
              if (objU.password == req.body.password) {

                  req.session.userLogin = objU;
                  return res.redirect('/product')
              } else {
                  msg = ' Password Error'
              }
          }else{
              msg='Not found user   '+  req.body.username;
              
          }
      } catch (error) {
          msg=error.massage
      }
  }
  res.render('admin/login',{msg:msg})
}


exports.register = async (req, res, next) => {
  let msg = '';
  if (req.body.password != req.body.password2) {
      msg = 'mật khẩu không khớp';
      return res.render('admin/register', { msg: msg })
  }
  if (req.body.password ==0|| req.body.username ==0|| req.body.full_name ==0|| req.body.permission ==0||req.body.avatar ==0 ) {
      msg = 'không để trống';
      return res.render('admin/register', { msg: msg })
  }

  if (req.method == 'POST') {
      console.log(req.body);
      
      try {
        let imageurl=await onUploadImages(req.file,'admin')
      
          let objU = new adminModel();

          objU.username = req.body.username;
          objU.full_name = req.body.full_name;
          objU.permission=req.body.permission;
          objU.avatar=req.body.avatar;
          objU.password = req.body.password;
          objU.email=req.body.email;
          objU.adress=req.body.adress;
          
          objU.created_at=new Date();
          await objU.save();
          
          msg = 'đăng kí thành công '

      } catch (error) {
        msg = 'đăng kí thất bại'+error
           

      }
  }
  
  res.render('admin/register',{msg:msg})
}
exports.Logout = (req, res, next) => {
  if (req.session != null) {
      req.session.destroy(function () {
          console.log("Đăng xuất")
          res.redirect('/');
      });
  }
}
exports.info=async(req,res,next)=>{
  let user=req.session.userLogin
  
  
  
  res.render('admin/info',{user:user});
}
exports.editinfo=async(req,res,next)=>{
let user=req.session.userLogin
let msg=''
if(req.method=='POST'){
  // let objU= new adminModel();
 
 let objU={
          full_name : req.body.full_name,
          permission:req.body.permission,
          avatar:req.body.avatar,
          email:req.body.email,
          adress:req.body.adress
        }
          

          try {
            await adminModel.findOneAndUpdate({_id:user._id},objU);
            user =await adminModel.findById(user._id)
            req.session.userLogin=user;
           
            msg='Edit success'
            // return res.redirect('/admin/info/editinfo')
        } catch (error) {
            msg='lỗi'+error.message;
            console.log(error);
        }


}
res.render('admin/editAdm',{user:user,msg:msg})
}