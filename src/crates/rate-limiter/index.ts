interface RateLimiterOptions {
  interval: number;  // Time window in ms
  maxRequests: number;  // Max requests per interval
}

export class RateLimiter {
  private timestamps: number[] = [];
  private interval: number;
  private maxRequests: number;

  constructor(options: RateLimiterOptions) {
    this.interval = options.interval;
    this.maxRequests = options.maxRequests;
  }

  /**
   * Check if action is allowed and record attempt
   */
  tryAcquire(): boolean {
    const now = Date.now();
    const windowStart = now - this.interval;

    // Remove old timestamps
    this.timestamps = this.timestamps.filter(t => t > windowStart);

    if (this.timestamps.length >= this.maxRequests) {
      return false;
    }

    this.timestamps.push(now);
    return true;
  }

  /**
   * Get remaining requests in current window
   */
  remaining(): number {
    const now = Date.now();
    const windowStart = now - this.interval;
    this.timestamps = this.timestamps.filter(t => t > windowStart);
    return Math.max(0, this.maxRequests - this.timestamps.length);
  }

  /**
   * Reset the limiter
   */
  reset(): void {
    this.timestamps = [];
  }
}
