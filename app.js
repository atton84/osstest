var express = require('express'), // express framework
    path = require('path'),
    fs = require('fs'),
    logger = require("./utils/logger"),
    //cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    http= require('http'),
    mongoose = require('mongoose'); // mongoose module for working with mongodb

var app = express(), // express app initializatin
    config = require('./config/config')(),

    controllers={   // here we can write list of controllers
        category:require('./controllers/category'),
    };

// view engine setup, views we can store in folder views
app.set('views', path.join(__dirname, config.viewsFolder));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

logger.debug("Overriding 'Express' logger");
app.use(require('morgan')({ "stream": logger.stream }));

//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// connecting to mongodb server

mongoose.connect('mongodb://'+config.mongo.host+'/'+config.mongo.base,function(err) {

  if (err) {
    logger.error(config.mongo.host + " - " + err.message);
    console.log('Sorry, there is no mongo db server running.');
  }
  else {
    var attach = function (req, res, next) {
      // here we can pass mongoose as param, to use it in controllers
      req.db = mongoose;
      res.renderPartial = function (name, params) {
        return ejs.render(fs.readFileSync(app.get('views') + name + '.ejs', 'utf-8'), params);
      }
      next();
    };

    // controller calls and routing

    app.all(['/'], attach, function(req, res, next){
      controllers.category.run(req, res, next);
    });

    app.all(['/category/list'], attach, function(req, res, next){
      controllers.category.list(req, res, next);
    });

    app.all(['/category/create'], attach, function(req, res, next){
      controllers.category.insertCategory(req, res, next);
    });

    app.all(['/category/edit/:id'], attach, function(req, res, next){
      controllers.category.editCategory(req, res, next);
    });

    app.all('/category/delete/:id', attach, function(req, res, next){
      controllers.category.deleteCategory(req, res, next);
    });


// catch 404 and forward to error handler
    app.use(function (req, res, next) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
    });


// error handler
    app.use(function (err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render('error');
    });

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
      logger.error(config.mongo.host+" - Not Found");
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
    });
    // error handlers

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
      app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        logger.error(config.mongo.host+" - "+err.message);
        res.render('error', {
          message: err.message,
          error: err
        });
      });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      logger.error(config.mongo.host+" - "+err.message);
      res.render('error', {
        message: err.message,
        error: {}
      });
    });

    // server initialization
    http.createServer(app).listen(config.port, function () {
      console.log(
          'Successfully connected to mongodb://' + config.mongo.host + ':' + config.mongo.port,
          '\nExpress server listening on port ' + config.port
      );
    });

  }
});

module.exports = app;
