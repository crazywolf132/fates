// src/crates/error/index.ts

import { Result, ok, err } from '../../result';
import { Option, some, none } from '../../option';

export interface ErrorMetadata {
  code?: string;
  status?: number;
  [key: string]: unknown;
}

/**
 * Base error class that provides rich error functionality
 */
export class BaseError extends Error {
  public readonly name: string;
  public readonly cause?: Error;
  public readonly metadata: ErrorMetadata;
  public readonly timestamp: Date;

  constructor(options: {
    message: string;
    name?: string;
    cause?: Error;
    metadata?: ErrorMetadata;
  }) {
    super(options.message);
    this.name = options.name ?? this.constructor.name;
    this.cause = options.cause;
    this.metadata = options.metadata ?? {};
    this.timestamp = new Date();

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Add additional metadata to the error
   */
  public withMetadata(metadata: ErrorMetadata): this {
    const NewError = this.constructor as new (...args: any[]) => this;
    return new NewError({
      message: this.message,
      name: this.name,
      cause: this.cause,
      metadata: { ...this.metadata, ...metadata }
    });
  }

  /**
   * Convert error to Result
   */
  public toResult<T>(): Result<T, this> {
    return err(this);
  }

  /**
   * Get the root cause of the error chain
   */
  public getRootCause(): Error {
    let current: Error = this;
    while ((current as BaseError).cause) {
      current = (current as BaseError).cause!;
    }
    return current;
  }

  /**
   * Get optional cause with type safety
   */
  public getCause<E extends Error>(): Option<E> {
    return this.cause instanceof Error ? some(this.cause as E) : none();
  }

  /**
   * Convert to structured object for logging/serialization
   */
  public toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      metadata: this.metadata,
      timestamp: this.timestamp.toISOString(),
      stack: this.stack,
      cause: this.cause instanceof BaseError ? this.cause.toJSON() : this.cause?.toString()
    };
  }

  /**
   * Create error chain string
   */
  public toErrorChain(): string {
    let chain = `${this.name}: ${this.message}`;
    if (Object.keys(this.metadata).length > 0) {
      chain += `\nMetadata: ${JSON.stringify(this.metadata, null, 2)}`;
    }
    if (this.cause) {
      chain += '\nCaused by: ';
      chain += this.cause instanceof BaseError
        ? this.cause.toErrorChain()
        : this.cause.toString();
    }
    return chain;
  }
}

/**
 * Error builder for creating custom error types
 */
export function createErrorType<T extends ErrorMetadata = ErrorMetadata>(
  name: string,
  defaultMetadata: Partial<T> = {}
) {
  return class CustomError extends BaseError {
    constructor(
      message: string,
      metadata?: T,
      cause?: Error
    ) {
      super({
        message,
        name,
        metadata: { ...defaultMetadata, ...metadata },
        cause
      });
    }

    // Type guard helper
    static isInstance(error: unknown): error is CustomError {
      return error instanceof CustomError;
    }
  };
}

// Common error types with default metadata
export const ValidationError = createErrorType<{
  code: string;
  field?: string;
  constraint?: string;
}>('ValidationError', { code: 'VALIDATION_ERROR' });

export const NotFoundError = createErrorType<{
  code: string;
  resource: string;
  id?: string | number;
}>('NotFoundError', { code: 'NOT_FOUND' });

export const TimeoutError = createErrorType<{
  code: string;
  timeout: number;
}>('TimeoutError', { code: 'TIMEOUT' });

// Utility functions
export function tryOrError<T>(fn: () => T): Result<T, BaseError> {
  try {
    return ok(fn());
  } catch (error) {
    if (error instanceof BaseError) {
      return err(error);
    }
    return err(new BaseError({
      message: error instanceof Error ? error.message : String(error),
      cause: error instanceof Error ? error : undefined
    }));
  }
}
