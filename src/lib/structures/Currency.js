class Currency {
  constructor(client) {
    Object.defineProperty(this, "client", { value: client });

    this.table = "currency";

    if (!client.providers.has("sqlite")) throw new Error(`The Provider ${this.providerEngine} does not seem to exist.`);
    if (!(this.provider.hasTable(this.table).then())) {
      const SQLCreate = ["id TEXT NOT NULL UNIQUE", "amount INTEGER NOT NULL DEFAULT 0"];
      this.provider.createTable(this.table, SQLCreate).then().catch(err => console.error(err));
    }
  }

  async changeBalance(user, amount) {
    if (typeof amount !== "number") throw "Expected parameter 'amount' to be type 'number'.";
    let row = await this.provider.get(this.table, user.id);
    if (!row) row = await this.create(user.id);
    await this.provider.update(this.table, user.id, { amount: row.amount + amount });
  }

  async getBalance(user) {
    const row = await this.provider.get(this.table, user.id);
    return row ? row.amount : 0;
  }

  async create(user) {
    await this.provider.create(this.table, user.id, { amount: 0 });
    return this.provider.get(this.table, user.id);
  }

  add(user, amount) {
    return this.changeBalance(user, amount);
  }

  remove(user, amount) {
    return this.changeBalance(user, -amount);
  }

  async reset(user) {
    const row = await this.provider.get(this.table, user.id);
    if (!row) await this.create(user.id);
    else await this.provider.update(this.table, user.id, { amount: 0 });
  }

  get provider() {
    return this.client.providers.get("sqlite");
  }
}

module.exports = Currency;
