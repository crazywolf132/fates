interface CacheOptions {
  maxSize?: number;
  ttl?: number; // Time to live in ms
}

export class Cache<K, V> {
  private cache = new Map<K, { value: V; timestamp: number }>();
  private maxSize: number;
  private ttl: number;

  constructor(options: CacheOptions = {}) {
    this.maxSize = options.maxSize ?? Infinity;
    this.ttl = options.ttl ?? Infinity;
  }

  set(key: K, value: V): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey!);
    }
    this.cache.set(key, { value, timestamp: Date.now() });
  }

  get(key: K): V | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.value;
  }

  has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  delete(key: K): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}
