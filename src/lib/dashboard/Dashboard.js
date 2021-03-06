/* eslint-disable class-methods-use-this */

// Node stuff
const url = require("url");
const { join, sep } = require("path");

// Settings
const settings = !process.env.PRODUCTION ? require("../../../settings") : null;

// Express App
const express = require("express");

// Start express
const app = express();

// Express Plugins
const passport = require("passport");
const session = require("express-session");
const { Strategy } = require("passport-discord");
const helmet = require("helmet");

// Other stuff
const DashboardUser = require("./DashboardUser");

/**
 * A class used to create a new dashboard.
 */
class Dashboard {
  /**
   * Creates a new instance of the dashboard.
   * @param {BoeBot} client BoeBot client.
   *
   */
  constructor(client) {
    /**
     * BoeBot client.
     * @type {BoeBot}
     */
    Object.defineProperty(this, "client", { value: client });

    /**
     * The port for the web server.
     * @type {number}
     */
    this.port = process.env.PORT || 8000;

    /**
     * The location of public files.
     * @type {string}
     */
    this.dataDir = this.client.dashboardDir;

    /**
     * The location of all templates.
     * @type {string}
     */
    this.templateDir = `${this.dataDir}templates${sep}`;

    /**
     * A collection of users that have signed into the dashboard
     * @type {external:Discord.Collection}
     */
    this.users = new this.client.methods.Collection();
  }

  /**
   * Check if user has logged in.
   * @param {external:Express.Request} req An express request object.
   * @param {external:Express.Response} res An express response object.
   * @param {external:Express.Next} next An express next function.
   * @return {null}
   */
  checkAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    req.session.backURL = req.url;
    return res.redirect("/login");
  }

  /**
   *  Check if the user is the owner.
   * @param {external:Express.Request} req An express request object.
   * @param {external:Express.Response} res An express response object.
   * @param {external:Express.Next} next An express next function.
   * @return {null}
   */
  checkAdmin(req, res, next) {
    if (req.isAuthenticated() && (req.user === settings.clientConfig.ownerID || req.user === process.env.OWNER_ID)) return next();
    req.session.backURL = req.originalURL;
    return res.redirect("/");
  }

  /**
   * Starts the web server.
   */
  start() {
    passport.serializeUser((user, done) => {
      done(null, user);
    });
    passport.deserializeUser((obj, done) => {
      done(null, obj);
    });

    passport.use(new Strategy({
      clientID: this.client.user.id,
      clientSecret: settings ? settings.dash.oauthSecret : process.env.DASH_OAUTH_SECRET,
      callbackURL: settings ? settings.dash.callback : process.env.DASH_CALLBACK_URL,
      scope: ["identify", "guilds"],
    }, (accessToken, refreshToken, profile, done) => {
      this.users.set(profile.id, new DashboardUser(this.client, profile));
      process.nextTick(() => done(null, profile.id));
    }));

    app.use(session({
      secret: "adamislife",
      resave: false,
      saveUninitialized: false,
    }));

    // Allow EJS files to be rendered
    app.engine("html", require("ejs").renderFile);

    // Set view engine to HTML with EJS
    app.set("view engine", "html");

    const bodyParser = require("body-parser");
    app.use(bodyParser.json()); // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
      extended: true,
    }));

    // Passport Init
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(helmet());

    // Public folder
    app.use(express.static(this.dataDir));
    // Docs page
    app.use("/docs", express.static(join(this.client.clientBaseDir, "../docs")));

    // Home page
    app.get("/", (req, res) => res.render(`${this.dataDir}index.ejs`, {
      client: this.client,
      user: req.isAuthenticated() ? this.users.get(req.user) : null,
      auth: req.isAuthenticated(),
    }));

    // Commands page
    app.get("/commands", (req, res) => res.render(`${this.dataDir}commands.ejs`, {
      client: this.client,
      user: req.isAuthenticated() ? this.users.get(req.user) : null,
      auth: req.isAuthenticated(),
    }));

    // Login
    app.get("/login", (req, res, next) => {
      if (req.session.backURL) {
        req.session.backURL = req.session.backURL;
      } else if (req.headers.referer) {
        const parsed = url.parse(req.headers.referer);
        if (parsed.hostname === app.locals.domain) {
          req.session.backURL = parsed.path;
        }
      } else {
        req.session.backURL = "/";
      }
      next();
    }, passport.authenticate("discord"));

    // Callback
    app.get("/callback", passport.authenticate("discord", { failureRedirect: "/autherror" }), (req, res) => {
      if (req.session.backURL) {
        res.redirect(req.session.backURL);
        req.session.backURL = null;
      } else {
        res.redirect("/");
      }
    });

    // Admin page
    app.get("/admin", this.checkAdmin, (req, res) => res.render(`${this.dataDir}admin.ejs`, {
      client: this.client,
      user: req.isAuthenticated() ? this.users.get(req.user) : null,
      auth: req.isAuthenticated(),
    }));

    // Dashboard page
    app.get("/dashboard", this.checkAuth, (req, res) => res.render(`${this.dataDir}dashboard.ejs`, {
      client: this.client,
      user: req.isAuthenticated() ? this.users.get(req.user) : null,
      auth: req.isAuthenticated(),
    }));

    // Guild page
    app.get("/guilds/:id", this.checkAuth, (req, res) => {
      const guild = this.client.guilds.get(req.params.id);
      return res.render(`${this.dataDir}guilds.ejs`, {
        client: this.client,
        user: req.isAuthenticated() ? this.users.get(req.user) : null,
        auth: req.isAuthenticated(),
        guild,
      });
    });

    // Logout
    app.get("/logout", (req, res) => {
      req.logout();
      res.redirect("/");
    });

    // 404 Page
    app.use((req, res) => res.status(404).render(`${this.dataDir}404.ejs`, {
      page: `${req.hostname}${req.originalUrl}`,
      user: req.isAuthenticated() ? this.users.get(req.user) : null,
      auth: req.isAuthenticated(),
    }));

    // Set port to 80
    app.set("port", this.port);

    // Listen on port 80
    app.listen(app.get("port"), () => this.client.emit("log", `Dashboard started. Listening on port ${app.get("port")}.`, "log"));
  }
}

module.exports = Dashboard;

/**
  * @external Express
  * @see {@link https://expressjs.com/}
  */

/**
  * @typedef {Object} Request
  * @memberof external:Express
  * @see {@link https://expressjs.com/en/4x/api.html#req}
  */

/**
  * @typedef {Object} Response
  * @memberof external:Express
  * @see {@link https://expressjs.com/en/4x/api.html#res}
  */

/**
  * @typedef {Function} Next
  * @memberof external:Express
  * @see {@link https://expressjs.com/en/guide/writing-middleware.html}
  */
