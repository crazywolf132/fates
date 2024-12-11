import { Option } from './option';
import { Some } from './some';

/**
 * None is the variant of Option that represents the absence of a value.
 */
export class None implements Option<never> {
  isSome(): this is Some<never> {
    return false;
  }

  isNone(): this is None {
    return true;
  }

  map<U>(_fn: (value: never) => U): Option<U> {
    return this;
  }

  unwrapOr<T>(defaultValue: T): T {
    return defaultValue;
  }

  unwrap(): never {
    throw new Error('Called unwrap on a None value');
  }

  match<U>(pattern: { some: (value: never) => U, none: () => U }): U {
    return pattern.none();
  }

  and<U>(_optb: Option<U>): Option<U> {
    return this;
  }

  or<T>(optb: Option<T>): Option<T> {
    return optb;
  }

  andThen<U>(_fn: (value: never) => Option<U>): Option<U> {
    return this;
  }

  orElse<T>(fn: () => Option<T>): Option<T> {
    return fn();
  }

  filter<T>(_predicate: (value: T) => boolean): Option<T> {
    return this;
  }

  unwrapOrElse<T>(fn: () => T): T {
    return fn();
  }

  flatten<U>(): Option<U> {
    return this;
  }

  zip<U>(_other: Option<U>): Option<[never, U]> {
    return this;
  }

  contains(_predicate: (value: never) => boolean): boolean {
    return false;
  }
}

