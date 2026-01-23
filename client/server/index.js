'use strict';

module.exports = function (app) {
  const morgan = require('morgan');
  app.use(morgan('dev'));

  const apiProxy = require('./proxies/api');
  const authProxy = require('./proxies/auth');

  apiProxy(app);
  authProxy(app);
};
