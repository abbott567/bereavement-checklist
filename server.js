'use strict';

const path = require('path');
const express = require('express');
const nunjucks = require('express-nunjucks');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const browserSync = require('browser-sync');

const routes = require(path.join(__dirname, '/app/routes.js'));
const config = require(path.join(__dirname, '/app/config.js'));
const utils = require(path.join(__dirname, '/lib/utils.js'));
const packageJson = require(path.join(__dirname, '/package.json'));
const session = require(path.join(__dirname, '/app/functions/session.js'));

const app = express();

// Grab environment variables specified in Procfile or as Heroku config vars
const releaseVersion = packageJson.version;
const username = process.env.USERNAME;
const password = process.env.PASSWORD;
const username2 = process.env.USERNAME2;
const password2 = process.env.PASSWORD2;
const env = (process.env.NODE_ENV || 'development').toLowerCase();
const useAuth = (process.env.USE_AUTH || config.useAuth).toLowerCase();
const useHttps = process.env.USE_HTTPS || config.useHttps;

// Authenticate against the environment-provided credentials, if running
// the app in production (Heroku, effectively)
if (env === 'production' && useAuth === 'true') {
  app.use(utils.basicAuth(username, password, username2, password2));
}

// Application settings
app.set('view engine', 'html');
app.set('views', [path.join(__dirname, '/app/views'), path.join(__dirname, '/lib/')]);

nunjucks.setup({
  autoescape: true,
  watch: true,
  noCache: true
}, app);

// Middleware to serve static assets
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use('/public', express.static(path.join(__dirname, '/govuk_modules/govuk_template/assets')));
app.use('/public', express.static(path.join(__dirname, '/govuk_modules/govuk_frontend_toolkit')));
app.use('/public/images/icons', express.static(path.join(__dirname, '/govuk_modules/govuk_frontend_toolkit/images')));

// Elements refers to icon folder instead of images folder
app.use(favicon(path.join(__dirname, 'govuk_modules', 'govuk_template', 'assets', 'images', 'favicon.ico')));

// Support for parsing data in POSTs
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(session);

// Redirect to https on production
if (env === 'production' && useHttps === 'true') {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      console.log('Redirecting request to https');
      // 302 temporary - this is a feature that can be disabled
      return res.redirect(302, `https://${req.get('Host')}${req.url}`);
    }
    next();
  });
}

// send assetPath to all views
/* eslint-disable camelcase */
app.use((req, res, next) => {
  res.locals.asset_path = '/public/';
  next();
});
/* eslint-enable camelcase */

// Add variables that are available in all views
app.use((req, res, next) => {
  res.locals.serviceName = config.serviceName;
  res.locals.cookieText = config.cookieText;
  res.locals.releaseVersion = `v${releaseVersion}`;
  next();
});

// routes (found in app/routes.js)
if (typeof (routes) === 'function') {
  app.use('/', routes);
} else {
  console.log(routes.bind);
  console.log('Warning: the use of bind in routes is deprecated - please check the prototype kit documentation for writing routes.');
  routes.bind(app);
}

// Custom routes
const router = require(path.join(__dirname, '/app/routes.js'));
app.use('/', router);
app.use('/version-1', require(path.join(__dirname, '/app/routes/version-1.js')));
app.use('/version-2', require(path.join(__dirname, '/app/routes/version-2.js')));
app.use('/version-3', require(path.join(__dirname, '/app/routes/version-3.js')));
app.use('/version-4', require(path.join(__dirname, '/app/routes/version-4.js')));
app.use('/version-5', require(path.join(__dirname, '/app/routes/version-5.js')));
app.use('/version-6', require(path.join(__dirname, '/app/routes/version-6.js')));
app.use('/janice-morrison', require(path.join(__dirname, '/app/routes/janice-morrison.js')));
app.use('/patrick-collins', require(path.join(__dirname, '/app/routes/patrick-collins.js')));
app.use('/steven-chapman', require(path.join(__dirname, '/app/routes/steven-chapman.js')));

// auto render any view that exists
app.get(/^\/([^.]+)$/, (req, res) => {
  const path = (req.params[0]);

  res.render(path, (err, html) => {
    if (err) {
      res.render(`${path}/index`, (err2, html) => {
        if (err2) {
          console.log(err);
          res.status(404).send(`${err}<br>${err2}`);
        } else {
          res.end(html);
        }
      });
    } else {
      res.end(html);
    }
  });
});

console.log(`\nGOV.UK Prototype kit v${releaseVersion}`);
// Display warning not to use kit for production services.
console.log('\nNOTICE: the kit is for building prototypes, do not use it for production services.');

// start the app
utils.findAvailablePort(app, port => {
  app.locals.port = port;
  console.log(`Listening on port ${port} url: http://localhost: ${port}`);
  if (env === 'production') {
    app.listen(port);
  } else {
    app.listen(port - 50, () => {
      browserSync({
        proxy: `localhost:${(port - 50)}`,
        port,
        ui: false,
        files: ['public/**/*.*', 'app/views/**/*.*'],
        ghostmode: false,
        open: false,
        notify: false,
        logLevel: 'error'
      });
    });
  }
});
