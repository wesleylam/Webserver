var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var tablesRouter = require('./routes/tables');
// var createEntryRouter = require('./routes/create-entry');

// knex
const options = require('./knexfile');
const knex = require('knex')(options);
// cors - cross origin??
const cors = require('cors');
//https
const fs = require('fs');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// setup cors
app.use(cors());
// setup db connection via knex
app.use((req, res, next) => {
    req.db = knex;
    next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/tables', tablesRouter);


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

// ---------- https / http server hosting ----------- //
var config = require("./config")
var server = null;

const https = require('https');
if (config.http == "https") {
    // https
    const https = require('https');
    const privateKey = fs.readFileSync('./sslcert/cert.key', 'utf8');
    const certificate = fs.readFileSync('./sslcert/cert.pem', 'utf8');
    const credentials = {
        key: privateKey,
        cert: certificate
    }
    server = https.createServer(credentials, app);
} else if (config.http == "http") {
    // http
    const https = require('http');
    server = https.createServer(app);
} else {
    throw new InvalidOperationException(`${config.http} is invalid, please choose between http / https`);
}

server.listen(config.port);
module.exports = app;

