let productModel = require("../../models/product.model").ProductModel;
let discountModel = require("../../models/discount.model").DiscountModel;
let chatbotModel = require("../../models/chatbot.model").ChatbotModel;
const { onUploadImages } = require("../../function/uploadImage");

exports.list = async (req, res, next) => {
  const messages = await req.consumeFlash("info");
  const locals = {
    title: "NodeJs",
    description: "Free NodeJs User Management System",
  };

  // let user = req.session.userLogin
  // res.json(user.username);

  let perPage = 5;
  let page = req.query.page || 1;

  try {
    const clients = await productModel
      .aggregate()
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
    const count = await productModel.count();

    res.render("viewProduct", {
      locals,
      clients,
      current: page,
      pages: Math.ceil(count / perPage),
      messages,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.listSort = async (req, res, next) => {
  const messages = await req.consumeFlash("info");

  let perPage = 5;
  let page = req.query.page || 1;

  try {
    if (req.query.hasOwnProperty("_sort")) {

      const clients = await productModel
        .aggregate()
        .sort({ [req.query.column]: req.query.type })
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();
      const count = await productModel.count();

      res.render("viewProduct", {
        clients,
        current: page,
        pages: Math.ceil(count / perPage),
        messages,
        req
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.view = async (req, res) => {
  try {
    const customer = await productModel.findOne({ _id: req.params.id });
    const discount = await discountModel.findOne({ _id: customer.id_discount });
    const chatbot = await chatbotModel.findOne({ _id: customer.id_chatbot });


    const locals = {
      title: "View Customer Data",
      description: "Free NodeJs User Management System",
    };

    res.render("product/detailPro", {
      locals,
      customer,
      discount,
      chatbot
    });
  } catch (error) {
    console.log(error);
  }
};

exports.insert = async (req, res, next) => {
  if (req.method == "POST") {
    let imageUrl = [];
    if (req.files) {
      imageUrl = await onUploadImages(req.files.filter((file) => file.fieldname == 'image'), "product");
    }

    let sizeStr = req.body.sizes;
    let sizes = [];
    sizes = sizeStr.split(",");

    let {
      name_product, detail_product,
      id_discount, color,
      quantity, price } = req.body;
    let newProduct = new productModel();
    newProduct.name_product = name_product;
    newProduct.detail_product = detail_product;
    newProduct.id_discount = id_discount;
    newProduct.sizes = sizes;
    newProduct.color = color;
    newProduct.quantity = quantity;
    newProduct.quantitySold = 0;
    newProduct.price = price;
    newProduct.created_at = new Date();
    newProduct.images = imageUrl;
    let idChatbot = await addChatbot(newProduct._id, req.body, req.files);
    newProduct.id_chatbot = idChatbot;
    await newProduct.save();
    return res.redirect("/product");
  }

  let arr_dis = await discountModel.find();
  res.render("product/addPro", {
    arr_dis,
  });

};

exports.edit = async (req, res) => {
  try {
    const Pro = await productModel.findById({ _id: req.params.id });
    let arr_dis = await discountModel.find();
    let dis = await discountModel.findById({ _id: Pro.id_discount });
    let chatbot = {};
    if (Pro.id_chatbot) {
      chatbot = await chatbotModel.findById(Pro.id_chatbot);
    }

    res.render("product/editPro", {
      Pro,
      arr_dis,
      dis,
      chatbot
    });
  } catch (error) {
    console.log(error);
  }
};

exports.editPost = async (req, res) => {
  let {
    name_product,
    detail_product,
    id_discount,
    color,
    quantity,
    price,
    images,
    created_at,
    _id,
  } = req.body;

  let imageUrl = [];
  if (req.files) {
    imageUrl = await onUploadImages(req.files.filter((file) => file.fieldname == 'image'), "product");
  }

  if (!imageUrl.length == 0) {
    images = imageUrl;
  }

  let sizes = [];
  let str = req.body.size;
  sizes = str.split(",");
  let product = await productModel.findById(_id);
  product.name_product = name_product;
  product.detail_product = detail_product;
  product.id_discount = id_discount;
  product.sizes = sizes;
  product.color = color;
  product.quantity = quantity;
  product.quantity = price;
  product.images = images;

  let idChatbot = await editChatbot(_id, product.id_chatbot, req.body, req.files);
  product.id_chatbot = idChatbot;
  await productModel.findByIdAndUpdate(_id, product);
  res.redirect("/product");
};

exports.delete = async (req, res) => {
  await productModel.deleteOne({ _id: req.params.id });
  await chatbotModel.deleteOne({ id_product: req.params.id });
  res.redirect("/product");
};

async function addChatbot(productId, body, files) {
  let newChatbot = new chatbotModel();
  let {
    radio_question1,
    radio_question2,
    radio_question3,
    radio_reply1,
    radio_reply2,
    radio_reply3
  } = body;
  newChatbot.id_product = productId;
  let questions = [];
  if (radio_question1 == "DefaultQuestion1") {
    questions.push("Bộ vest này còn hàng không shop?");
  } else {
    questions.push(body.custom_question1);
  }
  if (radio_question2 == "DefaultQuestion2") {
    questions.push("Tôi muốn biết mình vừa với size bao nhiêu thì phải làm sao?");
  } else {
    questions.push(body.custom_question2);
  }
  if (radio_question3 == "DefaultQuestion3") {
    questions.push("Bộ vest này còn màu khác không?");
  } else {
    questions.push(body.custom_question3);
  }
  newChatbot.questions = questions;
  let replies = [];
  if (radio_reply1 == "DefaultReply1") {
    replies.push("Sản phẩm này còn hàng bạn nhé!");
  } else {
    if (files) {
      let images = files.filter((file) => file.fieldname == 'image_reply1');
      let upload = await onUploadImages(images, "chatbot");
      if (upload.length > 0) {
        replies.push(body.custom_reply1 + "\nimage:'" + upload[0] + "'");
      } else {
        replies.push(body.custom_reply1);
      }
    } else {
      replies.push(body.custom_reply1);
    }
  }
  if (radio_reply2 == "DefaultReply2") {
    replies.push("Mời bạn xem ảnh bên dưới để biết được size phù hợp nhé? image:'https://theme.hstatic.net/1000333436/1001040510/14/vendor_value_4.jpg?v=141'");
  } else {
    if (files) {
      let images = files.filter((file) => file.fieldname == 'image_reply2');
      let upload = await onUploadImages(images, "chatbot");
      if (upload.length > 0) {
        replies.push(body.image_reply2 + "\nimage:'" + upload[0] + "'");
      } else {
        replies.push(body.image_reply2);
      }
    } else {
      replies.push(body.image_reply2);
    }
  }
  if (radio_reply3 == "DefaultReply3") {
    replies.push("Bạn hãy xem danh sách vest để tìm màu phù hợp với mình nhé!");
  } else {
    if (files) {
      let images = files.filter((file) => file.fieldname == 'image_reply3');
      let upload = await onUploadImages(images, "chatbot");
      if (upload.length > 0) {
        replies.push(body.image_reply3 + "\nimage:'" + upload[0] + "'");
      } else {
        replies.push(body.image_reply3);
      }
    } else {
      replies.push(body.image_reply3);
    }
  }
  newChatbot.replies = replies;
  newChatbot.created_at = new Date();
  await newChatbot.save();
  return newChatbot._id;
}

async function editChatbot(productId, chatbotId, body, files) {
  if (chatbotId) {
    let chatbot = await chatbotModel.findById(chatbotId);
    if (chatbot) {
      let {
        radio_question1,
        radio_question2,
        radio_question3,
        radio_reply1,
        radio_reply2,
        radio_reply3,
      } = body;
      let questions = [];
      if (radio_question1 == "DefaultQuestion1") {
        questions.push("Bộ vest này còn hàng không shop?");
      } else {
        questions.push(body.custom_question1);
      }
      if (radio_question2 == "DefaultQuestion2") {
        questions.push("Tôi muốn biết mình vừa với size bao nhiêu thì phải làm sao?");
      } else {
        questions.push(body.custom_question2);
      }
      if (radio_question3 == "DefaultQuestion3") {
        questions.push("Bộ vest này còn màu khác không?");
      } else {
        questions.push(body.custom_question3);
      }
      chatbot.questions = questions;
      let replies = [];
      if (radio_reply1 == "DefaultReply1") {
        replies.push("Sản phẩm này còn hàng bạn nhé!");
      } else {
        if (files) {
          let images = files.filter((file) => file.fieldname == 'image_reply1');
          let upload = await onUploadImages(images, "chatbot");
          if (upload.length > 0) {
            replies.push(body.custom_reply1 + "\nimage:'" + upload[0] + "'");
          } else {
            replies.push(body.custom_reply1);
          }
        } else {
          replies.push(body.custom_reply1);
        }
      }
      if (radio_reply2 == "DefaultReply2") {
        replies.push("Mời bạn xem ảnh bên dưới để biết được size phù hợp nhé? image:'https://theme.hstatic.net/1000333436/1001040510/14/vendor_value_4.jpg?v=141'");
      } else {
        if (files) {
          let images = files.filter((file) => file.fieldname == 'image_reply2');
          let upload = await onUploadImages(images, "chatbot");
          if (upload.length > 0) {
            replies.push(body.custom_reply2 + "\nimage:'" + upload[0] + "'");
          } else {
            replies.push(body.custom_reply2);
          }
        } else {
          replies.push(body.custom_reply2);
        }
      }
      if (radio_reply3 == "DefaultReply3") {
        replies.push("Bạn hãy xem danh sách vest để tìm màu phù hợp với mình nhé!");
      } else {
        if (files) {
          let images = files.filter((file) => file.fieldname == 'image_reply3');
          let upload = await onUploadImages(images, "chatbot");
          if (upload.length > 0) {
            replies.push(body.custom_reply3 + "\nimage:'" + upload[0] + "'");
          } else {
            replies.push(body.custom_reply3);
          }
        } else {
          replies.push(body.custom_reply3);
        }
      }
      chatbot.replies = replies;
      await chatbotModel.findByIdAndUpdate(chatbotId, chatbot);
      return chatbotId;
    } else {
      let id = await addChatbot(productId, body);
      return id;
    }
  } else {
    let id = await addChatbot(productId, body);
    return id;
  }
}