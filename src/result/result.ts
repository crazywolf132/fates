import type { Ok } from './ok';
import type { Err } from './err';
import type { Option } from '../option';
/**
 * Result<T, E> is the type used for returning and propagating errors.
 * It is an enum with the variants Ok(T) and Err(E).
 */
export interface Result<T, E = Error> {
  _tag: 'ok' | 'err';
  /**
   * Returns true if the result is Ok.
   */
  isOk(): this is Ok<T, E>;

  /**
   * Returns true if the result is Err.
   */
  isErr(): this is Err<T, E>;

  /**
   * Maps a Result<T, E> to Result<U, E> by applying a function to a contained Ok value.
   * @param fn - The function to apply to the Ok value.
   */
  map<U>(fn: (value: T) => U): Result<U, E>;

  /**
   * Maps a Result<T, E> to Result<T, F> by applying a function to a contained Err value.
   * @param fn - The function to apply to the Err value.
   */
  mapErr<F>(fn: (error: E) => F): Result<T, F>;

  /**
   * Returns the contained Ok value or a provided default.
   * @param defaultValue - The default value to return if the result is Err.
   */
  unwrapOr(defaultValue: T): T;

  /**
   * Unwraps the result, yielding the content of an Ok.
   * If the result is Err, throws the error.
   * Note: The return type changes based on whether this is Ok or Err
   */
  unwrap(): T;

  /**
   * Unwraps the result, yielding the result no matter the type.
   */
  safeUnwrap(): T | E;

  /**
   * Pattern matches on the Result
   * @param pattern - Object containing handlers for ok and err cases
   */
  match<U>(pattern: { ok: (value: T) => U; err: (error: E) => U }): U;

  /**
   * Returns Err if the result is Err, otherwise returns resb.
   * @param resb - Another Result to return if this one is Ok.
   */
  and<U>(resb: Result<U, E>): Result<U, E>;

  /**
   * Returns the result if it is Ok, otherwise returns resb.
   * @param resb - Another Result to return if this one is Err.
   */
  or(resb: Result<T, E>): Result<T, E>;

  /**
   * Calls fn if the result is Ok, otherwise returns the Err value of self.
   * @param fn - Function to apply to the Ok value.
   */
  andThen<U>(fn: (value: T) => Result<U, E>): Result<U, E>;

  /**
   * Calls fn if the result is Err, otherwise returns the Ok value of self.
   * @param fn - Function to apply to the Err value.
   */
  orElse<F>(fn: (error: E) => Result<T, F>): Result<T, F>;

  /**
   * Returns the contained Ok value or computes it from a closure.
   * @param fn - Function that computes a default value.
   */
  unwrapOrElse(fn: (error: E) => T): T;

  /**
   * Transposes a Result of an Option into an Option of a Result
   * @example
   * ok(some(5)).transpose() // some(ok(5))
   * ok(none()).transpose() // none()
   */
  transpose<U>(this: Result<Option<U>, E>): Option<Result<U, E>>;

  /**
   * Zips two results into a result of tuple
   * @example
   * ok(5).zip(ok(10)) // ok([5, 10])
   * ok(5).zip(err("error")) // err("error")
   */
  zip<U>(other: Result<U, E>): Result<[T, U], E>;
}

export type AsyncResult<T, E = Error> = Promise<Result<T, E>>;
