/**
 * Creates a new Currency handler.
 */
class Currency {
  /**
   * @param {Boebot} client Boebot client.
   */
  constructor(client) {
    /**
     * Boebot client.
     * @type {Boebot}
     */
    Object.defineProperty(this, "client", { value: client });

    /**
     * The name of the table.
     * @type {string}
     */
    this.table = "currency";

    /**
     * The SQL info for the table
     * @type {string[]}
     */
    this.sql = ["id TEXT NOT NULL UNIQUE", "amount INTEGER NOT NULL DEFAULT 0"];
  }

  /**
   * Creates the table.
   * @param {string} name The name for the table.
   */
  async createTable(name) {
    await this.provider.createTable(name, this.sql);
  }

  /**
   * Changes the balance of a users currency.
   * @param {external:Discord.User} user The user.
   * @param {number} amount The amount to add or subtract.
   */
  async changeBalance(user, amount) {
    if (typeof amount !== "number") throw "Expected parameter 'amount' to be type 'number'.";
    let row = await this.provider.get(this.table, user.id);
    if (!row) row = await this.create(user);
    await this.provider.update(this.table, user.id, { amount: row.amount + amount });
  }

  /**
   * Gets a users balance.
   * @param {external:Discord.User} user The user.
   * @return {number} The row amount or zero.
   */
  async getBalance(user) {
    const row = await this.provider.get(this.table, user.id);
    return row ? row.amount : 0;
  }

  /**
   * Creates an entry in the database.
   * @param {external:Discord.User} user The user.
   * @return {Object} The row for that user.
   */
  async create(user) {
    await this.provider.create(this.table, user.id, { amount: 0 });
    return this.provider.get(this.table, user.id);
  }

  /**
   * Adds an amount to the users balance.
   * @param {external:Discord.User} user The user.
   * @param {number} amount The amount to add.
   * @return {void}
   */
  add(user, amount) {
    return this.changeBalance(user, amount);
  }

  /**
   * Removies an amount from the users balance.
   * @param {external:Discord.User} user The user.
   * @param {number} amount The amount to remove.
   * @return {void}
   */
  remove(user, amount) {
    return this.changeBalance(user, -amount);
  }

  /**
   * Sets a users balance.
   * @param {external:Discord.User} user The user.
   * @param {number} amount The amount to set the balance to.
   */
  async set(user, amount) {
    if (typeof amount !== "number") throw "Expected parameter 'amount' to be type 'number'.";
    const row = await this.provider.get(this.table, user.id);
    if (!row) {
      await this.create(user);
      await this.changeBalance(user, amount);
    } else await this.provider.update(this.table, user.id, { amount });
  }

  /**
   * Clears a users balance.
   * @param {external:Discord.User} user The user.
   * @param {number} [amount=0] The amount to clear the balance to.
   */
  async reset(user, amount = 0) {
    if (typeof amount !== "number") throw "Expected parameter 'amount' to be type 'number'.";
    const row = await this.provider.get(this.table, user.id);
    if (!row) await this.create(user.id);
    else await this.provider.update(this.table, user.id, { amount });
  }

  /**
   * The provider engine.
   * @type {Object}
   */
  get provider() {
    return this.client.providers.get("sqlite");
  }
}

module.exports = Currency;
