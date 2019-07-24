/*MIDLWARES-FUNCIONES QUE SE EJECUTAN ANTES DE USERS.JS */
require('./config/mongoose');// importo la configuracion del archivo mongoose
require('./config/sequelize');// importo la configuracion del archivo sequelize

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');// importo el router en la aplicación principal
var destinationsRouter=require('./routes/destinations');
var app = express();
// const winston=require('../config/winston');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);//aplicamos el router como middleware, es decir todas la rutas dirigidas a /users pasaran por el router creado
app.use('/destinations',destinationsRouter);

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

module.exports = app;//exporto
