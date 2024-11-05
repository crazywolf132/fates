import { type Option, some } from '../option';
import { type Ok } from './ok';
import { type Result } from './result';

/**
 * Err<T, E> is the variant of Result that contains an error value.
 */
export class Err<T, E> implements Result<T, E> {
  constructor(private readonly value: E) { }

  isOk(): this is Ok<T, E> {
    return false;
  }

  isErr(): this is Err<T, E> {
    return true;
  }

  map<U>(_fn: (value: T) => U): Result<U, E> {
    return this as unknown as Result<U, E>;
  }

  mapErr<F>(fn: (error: E) => F): Result<T, F> {
    return new Err(fn(this.value));
  }

  unwrapOr(defaultValue: T): T {
    return defaultValue;
  }

  unwrap(): T {
    throw new Error(`Called unwrap on an Err value: ${this.value}`);
  }

  safeUnwrap(): E {
    return this.value;
  }

  match<U>(pattern: { ok: (value: T) => U; err: (error: E) => U }): U {
    return pattern.err(this.value);
  }

  and<U>(_resb: Result<U, E>): Result<U, E> {
    return this as unknown as Result<U, E>;
  }

  or(resb: Result<T, E>): Result<T, E> {
    return resb;
  }

  andThen<U>(_fn: (value: T) => Result<U, E>): Result<U, E> {
    return this as unknown as Result<U, E>;
  }

  orElse<F>(fn: (error: E) => Result<T, F>): Result<T, F> {
    return fn(this.value);
  }

  unwrapOrElse(fn: (error: E) => T): T {
    return fn(this.value);
  }

  transpose<U>(): Option<Result<U, E>> {
    return some(this as unknown as Result<U, E>);
  }

  zip<U>(_other: Result<U, E>): Result<[T, U], E> {
    return this as unknown as Result<[T, U], E>;
  }
}

/**
 * Creates an Err result containing the given error.
 * @param error - The error to wrap in an Err.
 */
export function err<T, E>(error: E): Result<T, E> {
  return new Err(error);
}
export const isErr = <T, E>(result: Result<T, E>): result is Err<T, E> => result.isErr();
