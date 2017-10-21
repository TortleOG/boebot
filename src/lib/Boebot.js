/* eslint-disable no-underscore-dangle */

const { Client } = require("komada");
const { join, sep } = require("path");
const settings = !process.env.PRODUCTION ? require("../../settings") : null;

const Currency = require("./structures/Currency");
const NYTimes = require("./structures/NYTimes");
const Dashboard = require("./dashboard/Dashboard");

/**
  * The great class for BoeBot.
  * @extends external:Komada.KomadaClient
  */
class BoeBot extends Client {
  /**
   * Creates a new instance of BoeBot.
   * @param {external:Komada.KomadaOptions} options The config options to provide Komada.
   */
  constructor(options) {
    super(options);
    /**
     * The NYTimes API wrapper.
     * @type {Class}
     */
    this.NYTimes = new NYTimes(settings ? settings.NYT.key : process.env.NYT_API_KEY);

    /**
     * A wrapper for Currency commands.
     * @type {Class}
     */
    this.Currency = null;

    /**
     * The location of all dashboard related files.
     * @type {string}
     */
    this.dashboardDir = join(this.clientBaseDir, `../public${sep}`);

    this.once("ready", this._rdy.bind(this));
  }

  _rdy() {
    this.Currency = new Currency(this);
    new Dashboard(this).start();
  }
}

module.exports = BoeBot;

/**
 * @external Komada
 * @see {@link https://komada.js.org/}
 */

/**
 * @typedef {Class} KomadaClient
 * @memberof external:Komada
 * @see {@link https://komada.js.org/Komada.html}
 */

/**
 * @typedef {Object} KomadaOptions
 * @memberof external:Komada
 * @see {@link https://komada.js.org/Komada.html#.Options}
 */

/**
  * @external Discord
  * @see {@link https://discord.js.org/#/docs/main/master/general/welcome}
  */

/**
  * @typedef {Object} MessageEmbed
  * @memberof external:Discord
  * @see {@link https://discord.js.org/#/docs/main/master/class/MessageEmbed}
  */

/**
 * @typedef {Class} Collection
 * @memberof external:Discord
 * @extends {Map}
 * @see {@link https://discord.js.org/#/docs/main/master/class/Collection}
 */

/**
 * @typedef {Object} User
 * @memberof external:Discord
 * @see {@link https://discord.js.org/#/docs/main/master/class/User}
 */

/**
 * @typedef {Object} Guild
 * @memberof external:Discord
 * @see {@link https://discord.js.org/#/docs/main/master/class/Guild}
 */
