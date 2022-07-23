interface ValueWrapper<Value> {
  value: Value;
  expiration: number;
}

export class Cache<Key, Value> {
  private readonly cache = new Map<Key, ValueWrapper<Value>>();

  public constructor(
    private readonly _fetchValue: (key: Key) => Promise<Value>,
    private readonly _validDelayInMs = 60_000
  ) {
    setInterval(() => {
      const toDelete = [...this.cache.entries()].filter(([, v]) => v.expiration < Date.now());
      for (const [key] of toDelete) {
        this.cache.delete(key);
      }
    }, 600_000); // 10 minutes
  }

  public async get(key: Key) {
    const wrapper = this.cache.get(key);

    if (wrapper != null && wrapper.expiration > Date.now()) {
      return wrapper.value;
    }

    const value = await this._fetchValue(key);
    this.cache.set(key, { value, expiration: Date.now() + this._validDelayInMs });

    return value;
  }
}
