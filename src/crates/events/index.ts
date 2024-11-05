type EventMap = Record<string | symbol, any>;
type EventKey<T extends EventMap> = string & keyof T;
type EventCallback<T> = (arg: T) => void;
type UnsubscribeFn = () => void;

export class TypedEventEmitter<T extends EventMap> {
  private static defaultMaxListeners = 10;
  private listeners = new Map<keyof T, Set<EventCallback<any>>>();
  private onceListeners = new Map<keyof T, Set<EventCallback<any>>>();
  private _maxListeners: number = TypedEventEmitter.defaultMaxListeners;


  get maxListeners(): number {
    return this._maxListeners;
  }

  set maxListeners(n: number) {
    if (n < 0) {
      throw new Error('maxListeners must be a non-negative number');
    }
    this._maxListeners = n;
  }

  static setDefaultMaxListeners(n: number): void {
    if (n < 0) {
      throw new Error('maxListeners must be a non-negative number');
    }
    TypedEventEmitter.defaultMaxListeners = n;
  }

  /**
   * Add event listener
   * @returns Unsubscribe function
   */
  on<K extends EventKey<T>>(event: K, callback: EventCallback<T[K]>): UnsubscribeFn {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    const listeners = this.listeners.get(event)!;
    if (this.maxListeners !== 0 && listeners.size >= this.maxListeners) {
      console.warn(
        `MaxListenersExceededWarning: Possible memory leak detected. ${listeners.size} ${event} listeners added. ` +
        'Use emitter.setMaxListeners() to increase limit'
      );
    }

    listeners.add(callback);
    return () => this.off(event, callback);
  }
  /**
   * Remove event listener
   */
  off<K extends EventKey<T>>(event: K, callback: EventCallback<T[K]>): void {
    this.listeners.get(event)?.delete(callback);
    this.onceListeners.get(event)?.delete(callback);
  }

  /**
   * Emit event
   * Returns true if there were listeners for the event
   */
  emit<K extends EventKey<T>>(event: K, arg: T[K]): boolean {
    let hasListeners = false;

    const listeners = this.listeners.get(event);
    if (listeners) {
      hasListeners = true;
      listeners.forEach(callback => callback(arg));
    }

    const onceListeners = this.onceListeners.get(event);
    if (onceListeners) {
      hasListeners = true;
      onceListeners.forEach(callback => callback(arg));
      this.onceListeners.delete(event);
    }

    return hasListeners;
  }

  /**
   * Add one-time event listener
   * @returns Unsubscribe function
   */
  once<K extends EventKey<T>>(event: K, callback: EventCallback<T[K]>): UnsubscribeFn {
    if (!this.onceListeners.has(event)) {
      this.onceListeners.set(event, new Set());
    }
    this.onceListeners.get(event)!.add(callback);
    return () => this.off(event, callback);
  }

  /**
   * Listen to multiple events with the same callback
   * @returns Unsubscribe function for all events
   */
  onMany<K extends EventKey<T>>(events: K[], callback: EventCallback<T[K]>): UnsubscribeFn {
    const unsubscribers = events.map(event => this.on(event, callback));
    return () => unsubscribers.forEach(unsub => unsub());
  }

  /**
   * Get number of listeners for an event
   */
  listenerCount<K extends EventKey<T>>(event: K): number {
    return (this.listeners.get(event)?.size ?? 0) +
      (this.onceListeners.get(event)?.size ?? 0);
  }

  /**
   * Check if event has any listeners
   */
  hasListeners<K extends EventKey<T>>(event: K): boolean {
    return this.listenerCount(event) > 0;
  }

  /**
   * Get all current event names
   */
  eventNames(): Array<keyof T> {
    const events = new Set([
      ...this.listeners.keys(),
      ...this.onceListeners.keys()
    ]);
    return Array.from(events);
  }

  /**
   * Remove all listeners for an event
   */
  removeAllListeners<K extends EventKey<T>>(event?: K): void {
    if (event) {
      this.listeners.delete(event);
      this.onceListeners.delete(event);
    } else {
      this.listeners.clear();
      this.onceListeners.clear();
    }
  }

  /**
   * Set max listeners (default is unlimited)
   */
  setMaxListeners(n: number): void {
    this.maxListeners = n;
  }

  /**
   * Create a promise that resolves on the next emission of an event
   */
  waitFor<K extends EventKey<T>>(event: K): Promise<T[K]> {
    return new Promise(resolve => this.once(event, resolve));
  }
}

// Example usage:
interface UserEvents {
  login: { userId: string; timestamp: number };
  logout: { userId: string; timestamp: number };
  profileUpdate: { userId: string; fields: string[] };
}

const userEvents = new TypedEventEmitter<UserEvents>();

// Type-safe event listening
const unsubscribe = userEvents.on('login', ({ userId, timestamp }) => {
  console.log(`User ${userId} logged in at ${timestamp}`);
});

// Multiple event listening
userEvents.onMany(['login', 'logout'], ({ userId }) => {
  console.log(`User ${userId} activity detected`);
});

// Promise-based waiting
async function handleNextLogin() {
  const { userId } = await userEvents.waitFor('login');
  console.log(`Next login was from ${userId}`);
}
