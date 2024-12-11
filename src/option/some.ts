import { Option } from './option';
import { None } from './none';

/**
 * Some<T> is the variant of Option that contains a value.
 */
export class Some<T> implements Option<T> {
  constructor(private readonly value: T) { }

  isSome(): this is Some<T> {
    return true;
  }

  isNone(): this is None {
    return false;
  }

  map<U>(fn: (value: T) => U): Option<U> {
    return new Some(fn(this.value));
  }

  unwrapOr(_defaultValue: T): T {
    return this.value;
  }

  unwrap(): T {
    return this.value;
  }

  match<U>(pattern: { some: (value: T) => U, none: () => U }): U {
    return pattern.some(this.value);
  }

  and<U>(optb: Option<U>): Option<U> {
    return optb;
  }

  or(_optb: Option<T>): Option<T> {
    return this;
  }

  andThen<U>(fn: (value: T) => Option<U>): Option<U> {
    return fn(this.value);
  }

  orElse(_fn: () => Option<T>): Option<T> {
    return this;
  }

  filter(predicate: (value: T) => boolean): Option<T> {
    return predicate(this.value) ? this : new None();
  }

  unwrapOrElse(_fn: () => T): T {
    return this.value;
  }

  flatten<U>(this: Some<Option<U>>): Option<U> {
    return this.value;
  }

  zip<U>(other: Option<U>): Option<[T, U]> {
    return other.map(otherValue => [this.value, otherValue]);
  }

  contains(predicate: (value: T) => boolean): boolean {
    return predicate(this.value);
  }

}

