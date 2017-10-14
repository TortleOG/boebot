const { Client } = require("komada");
const { join, sep } = require("path");
const settings = !process.env.PRODUCTION ? require("../../settings") : null;

const Currency = require("./structures/Currency");
const NYTimes = require("./structures/NYTimes");

/**
 * @typedef  {object}   OptionsDisabled
 * @property {string[]} [commands=Array]    Disabled Commands
 * @property {string[]} [events=Array]      Disabled Events
 * @property {string[]} [functions=Array]   Disabled Functions
 * @property {string[]} [inhibitors=Array]  Disabled Inhibitors
 * @property {string[]} [finalizers=Array]  Disabled Finalizers
 * @property {string[]} [monitors=Array]    Disabled Monitors
 * @property {string[]} [providers=Array]   Disabled Providers
 * @property {string[]} [extendables=Array] Disabled Extendables
 * @memberof external:KomadaClient
 */

/**
 * @typedef {Object} OptionsProviders
 * @property {string} [engine=json] The Provider Engine SettingGateway will use to store and access to the persistent data.
 * @property {string} [cache=js]    The Provider Cache Engine CacheManager from SettingGateway will use to cache the data.
 * @memberof external:KomadaClient
 */

/**
 * @typedef {Object} KomadaOptions
 * @property {string}  [prefix=?] The prefix for Komada. Defaults to '?'.
 * @property {string}  [ownerID=String] The bot owner's ID, Komada will autofetch it if it's not specified.
 * @property {external:KomadaClient.OptionsDisabled}  [disabled={}] The disabled pieces.
 * @property {PermissionLevels|Array<{}>} [permStructure=Array<{}>] The PermStructure for Komada.
 * @property {boolean} [selfbot=boolean] Whether the bot is a selfbot or not. Komada detects this automatically.
 * @property {string}  [readyMessage=String] A custom string message Komada will use when firing the ready event message.
 * @property {number}  [commandMessageLifetime=1800] The lifetime for the command messages, in milliseconds.
 * @property {number}  [commandMessageSweep=900] How frequent should Komada sweep the command messages.
 * @property {boolean} [disableLogTimestamps=false] Whether the komada logger should show the timestamps.
 * @property {boolean} [disableLogColor=false] Whether the komada logger should show colours.
 * @property {boolean} [cmdEditing=false] Whether Komada should consider edited messages as potential messages able to fire new commands.
 * @property {boolean} [cmdPrompt=false] Whether Komada should prompt missing/invalid arguments at failed command execution.
 * @property {external:KomadaClient.OptionsProviders}  [provider={}] The engines for SettingGateway, 'engine' for Persistent Data, 'cache' for Cache Engine (defaults to Collection)
 * @memberof external:KomadaClient
 */

/**
  * @typedef {Object} Options
  * @property {external:KomadaClient.KomadaOptions} options Komadas options
  * @memberof BoeBot
  */

/**
  * The great class for BoeBot
  * @extends external:KomadaClient
  */
class BoeBot extends Client {
  /**
   * Creates a new instance of BoeBot
   * @param {BoeBot.Options} options The config options to provide Komada
   */
  constructor(options) {
    super(options);
    /**
     * The NYTimes API wrapper
     * @type {Class}
     */
    this.NYTimes = new NYTimes(settings ? settings.NYT.key : process.env.NYT_API_KEY);

    this.Currency = new Currency(this);

    /**
     * The location of all dashboard related files
     * @type {string}
     */
    this.dashboardDir = join(this.clientBaseDir, `../public${sep}`);
  }
}

module.exports = BoeBot;

/**
 * @external KomadaClient
 * @see {@link https://komada.js.org/}
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
