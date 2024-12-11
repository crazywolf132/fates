import { type Option, some } from '../option';
import { type Ok } from './ok';
import { type Result } from './result';

/**
 * Err<T, E> is the variant of Result that contains an error value.
 */
export class Err<T, E> implements Result<T, E> {
  readonly _tag: 'err' = 'err';
  
  constructor(private readonly value: E) {}

  isOk(): this is Ok<T, E> {
    return false;
  }

  isErr(): this is Err<T, E> {
    return true;
  }

  map<U>(_fn: (value: T) => U): Result<U, E> {
    return new Err<U, E>(this.value);
  }

  mapErr<F>(fn: (error: E) => F): Result<T, F> {
    return new Err<T, F>(fn(this.value)) as Result<T, F>;
  }

  unwrapOr(defaultValue: T): T {
    return defaultValue;
  }

  unwrap(): T {
    throw this.value;
  }

  safeUnwrap(): T | E {
    return this.value;
  }

  match<U>(pattern: { ok: (value: T) => U; err: (error: E) => U }): U {
    return pattern.err(this.value);
  }

  and<U>(_resb: Result<U, E>): Result<U, E> {
    return new Err<U, E>(this.value);
  }

  or(resb: Result<T, E>): Result<T, E> {
    return resb;
  }

  andThen<U>(_fn: (value: T) => Result<U, E>): Result<U, E> {
    return new Err<U, E>(this.value)
  }

  orElse<F>(fn: (error: E) => Result<T, F>): Result<T, F> {
    return fn(this.value);
  }

  unwrapOrElse(fn: (error: E) => T): T {
    return fn(this.value);
  }

  transpose<U>(this: Err<Option<U>, E>): Option<Result<U, E>> {
    return some(new Err<U, E>(this.value));
  }

  zip<U>(_other: Result<U, E>): Result<[T, U], E> {
    return new Err<[T, U], E>(this.value);
  }
}

/**
 * Creates an Err result containing the given error.
 * @param error - The error to wrap in an Err.
 */
export function err<T, E>(error: E): Result<T, E> {
  return new Err(error) as Result<T, E>;
}

/**
 * Type guard for Err
 */
export const isErr = <T, E>(result: Result<T, E>): result is Err<T, E> => 
  result._tag === 'err';
