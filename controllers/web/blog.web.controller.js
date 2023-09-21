let blogModel = require('../../models/blog.model').BlogModel;

exports.list = async (req, res, next) => {
    let arr_blog = await blogModel.find().populate('id_product');
    res.send(arr_blog)
}

exports.insert = async (req, res, next) => {
    if (req.method == "POST") {
        let { id_product, description, expires_at } = req.body;
        let newBlog = new blogModel();
        newBlog.id_product = id_product;
        newBlog.description = description;
        newBlog.expires_at = expires_at;
        newBlog.created_at = new Date();
        await newBlog.save();
        return res.send(newBlog);
    }
    res.send('List')
}