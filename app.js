var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//Api
var billApiRoute = require('./routes/api/bill.api.route');
var blogApiRoute = require('./routes/api/blog.api.route');
var chatbotApiRoute = require('./routes/api/chatbot.api.route');
var cartApiRoute = require('./routes/api/cart.api.route');
var clientApiRoute = require('./routes/api/client.api.route');
var discountApiRoute = require('./routes/api/discount.api.route');
var productApiRoute = require('./routes/api/product.api.route');
//
var adminRoute = require('./routes/web/admin.web.route');
var billRoute = require('./routes/web/bill.web.route');
var blogRoute = require('./routes/web/blog.web.route');
var chatbotRoute = require('./routes/web/chatbot.web.route');
var clientRoute = require('./routes/web/client.web.route');
var discountRoute = require('./routes/web/discount.web.route');
var productRoute = require('./routes/web/product.web.route');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//api
app.use('/api/bill', billApiRoute);
app.use('/api/blog', blogApiRoute);
app.use('/api/chatbot', chatbotApiRoute);
app.use('/api/cart', cartApiRoute);
app.use('/api/client', clientApiRoute);
app.use('/api/discount', discountApiRoute);
app.use('/api/product', productApiRoute);
//web
app.use('/', adminRoute);
app.use('/bill', billRoute);
app.use('/blog', blogRoute);
app.use('/chatbot', chatbotRoute);
app.use('/client', clientRoute);
app.use('/discount', discountRoute);
app.use('/product', productRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
