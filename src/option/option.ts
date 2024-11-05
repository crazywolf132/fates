/**
 * Represents an optional value. An instance of Option<T> is either an instance of Some<T> or None.
 */
export interface Option<T> {
  /**
   * Returns true if the option is a Some value.
   */
  isSome(): this is Some<T>;

  /**
   * Returns true if the option is a None value.
   */
  isNone(): this is None;

  /**
   * Maps an Option<T> to Option<U> by applying a function to a contained value.
   * @param fn - The function to apply to the contained value.
   */
  map<U>(fn: (value: T) => U): Option<U>;

  /**
   * Returns the contained Some value or a provided default.
   * @param defaultValue - The default value to return if the option is None.
   */
  unwrapOr(defaultValue: T): T;

  /**
   * Unwraps the option, yielding the content of a Some.
   * Throws if the value is a None.
   */
  unwrap(): T;

  /**
   * Calls the provided closure with the contained value if the option is Some.
   * @param pattern - Object containing handlers for some and none cases
   */
  match<U>(pattern: { some: (value: T) => U; none: () => U }): U;

  /**
   * Returns None if the option is None, otherwise returns optb.
   * @param optb - Another Option to return if this one is Some.
   */
  and<U>(optb: Option<U>): Option<U>;

  /**
   * Returns the option if it contains a value, otherwise returns optb.
   * @param optb - Another Option to return if this one is None.
   */
  or(optb: Option<T>): Option<T>;

  /**
   * Returns None if the option is None, otherwise calls fn with the wrapped value and returns the result.
   * @param fn - Function to apply to the wrapped value.
   */
  andThen<U>(fn: (value: T) => Option<U>): Option<U>;

  /**
   * Returns the option if it contains a value, otherwise calls fn and returns the result.
   * @param fn - Function that returns an Option.
   */
  orElse(fn: () => Option<T>): Option<T>;

  /**
   * Returns None if the option is None, otherwise calls predicate with the wrapped value and returns:
   * - Some(t) if predicate returns true.
   * - None if predicate returns false.
   * @param predicate - Function to test the wrapped value.
   */
  filter(predicate: (value: T) => boolean): Option<T>;

  /**
   * Returns the contained Some value or computes it from a closure.
   * @param fn - Function that computes a default value.
   */
  unwrapOrElse(fn: () => T): T;

  /**
   * Converts from Option<Option<T>> to Option<T>
   * @example
   * some(some(5)).flatten() // some(5)
   * some(none()).flatten() // none()
   */
  flatten<U>(this: Option<Option<U>>): Option<U>;

  /**
   * Zips two options into an option of tuple
   * @example
   * some(5).zip(some(10)) // some([5, 10])
   * some(5).zip(none()) // none()
   */
  zip<U>(other: Option<U>): Option<[T, U]>;

  /**
   * Returns true if the option is a Some and the value inside matches the predicate
   * @example
   * some(5).contains(x => x > 3) // true
   * some(2).contains(x => x > 3) // false
   */
  contains(predicate: (value: T) => boolean): boolean;
}

import { Some } from './some';
import { None } from './none';

/**
 * Creates an Option from a value.
 * If the value is null or undefined, returns None, otherwise returns Some<T>.
 * @param value - The value to create an Option from.
 */
export function option<T>(value: T | null | undefined): Option<T> {
  return value == null ? none<T>() : some(value);
}

/**
 * Creates a Some<T> containing the given value.
 * @param value - The value to wrap in a Some.
 */
export function some<T>(value: T): Option<T> {
  return new Some(value);
}

/**
 * Returns a None value.
 */
export function none<T>(): Option<T> {
  return new None();
}

export const isSome = <T>(optional: Option<T>): optional is Some<T> => optional.isSome()
export const isNone = <T>(optional: Option<T>): optional is None => optional.isNone()

export type AsyncOption<T> = Promise<Option<T>>;
