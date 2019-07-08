var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var { Mongoose } = require('./utils/config');
const tokenUtil = require('./utils/token');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);

Mongoose.connect();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// 校验中间件
app.use((req,res,next)=>{
  // 检验token是否过期
  if(req.url !== '/api/users/register'){
    let token = req.headers.token;
    const resDecode = tokenUtil.checkToken(token);
    if(!resDecode){
      res.send({
        msg: '登录已过期，请重新登录',
        status: 403
      })
    }else{
      next()
    }
  }else{
    next()
  }
});

// error handler
//原error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
