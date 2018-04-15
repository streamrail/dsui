const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const ds = require('./middlewares/ds');

const indexRouter = require('./routes/index');
const entityRouter = require('./routes/entity');

module.exports = (
  {
    ds: {
    projectId,
    apiEndpoint
    } 
  }
) => {
  const app = express();

  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');
  app.use(ds({
    projectId,
    apiEndpoint
  }))
  if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
  }
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/bootstrap', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/')));

  app.use('/', indexRouter);
  app.use('/', entityRouter);

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
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
  return app;
}