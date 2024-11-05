import type { Option } from '../option';
import { type Err } from './err';
import { type Result } from './result';

/**
 * Ok<T, E> is the variant of Result that contains a success value.
 */
export class Ok<T, E> implements Result<T, E> {
  constructor(private readonly value: T) { }

  isOk(): this is Ok<T, E> {
    return true;
  }

  isErr(): this is Err<T, E> {
    return false;
  }

  map<U>(fn: (value: T) => U): Result<U, E> {
    return new Ok(fn(this.value));
  }

  mapErr<F>(_fn: (error: E) => F): Result<T, F> {
    return this as unknown as Result<T, F>;
  }

  unwrapOr(_defaultValue: T): T {
    return this.value;
  }

  unwrap(): T {
    return this.value;
  }

  safeUnwrap(): T {
    return this.value;
  }

  match<U>(pattern: { ok: (value: T) => U; err: (error: E) => U }): U {
    return pattern.ok(this.value);
  }

  and<U>(resb: Result<U, E>): Result<U, E> {
    return resb;
  }

  or(_resb: Result<T, E>): Result<T, E> {
    return this;
  }

  andThen<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
    return fn(this.value);
  }

  orElse<F>(_fn: (error: E) => Result<T, F>): Result<T, F> {
    return this as unknown as Result<T, F>;
  }

  unwrapOrElse(_fn: (error: E) => T): T {
    return this.value;
  }

  transpose<U>(this: Ok<Option<U>, E>): Option<Result<U, E>> {
    return this.value.map(v => ok(v));
  }

  zip<U>(other: Result<U, E>): Result<[T, U], E> {
    return other.map(otherValue => [this.value, otherValue]);
  }
}

/**
 * Creates an Ok result containing the given value.
 * @param value - The value to wrap in an Ok.
 */
export function ok<T, E>(value: T): Result<T, E> {
  return new Ok(value);
}

export const isOk = <T, E>(result: Result<T, E>): result is Ok<T, E> => result.isOk();
