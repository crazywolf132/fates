// src/validation/validation.ts

import { Result, ok, err } from '../result';
import { Option, some, none } from '../option';

export type Validation<T, E = Error> = Valid<T, E> | Invalid<T, E>;

export class Valid<T, E> {
  readonly _tag: 'Valid' = 'Valid';

  constructor(private readonly value: T) { }

  isValid(): this is Valid<T, E> {
    return true;
  }

  isInvalid(): this is Invalid<T, E> {
    return false;
  }

  unwrap(): T {
    return this.value;
  }

  map<U>(fn: (value: T) => U): Validation<U, E> {
    return new Valid(fn(this.value));
  }

  mapError<F>(_fn: (errors: E[]) => F[]): Validation<T, F> {
    return new Valid(this.value);
  }

  toResult(): Result<T, E[]> {
    return ok(this.value);
  }

  toOption(): Option<T> {
    return some(this.value);
  }

  and<U>(other: Validation<U, E>): Validation<U, E> {
    return other;
  }

  or(_other: Validation<T, E>): Validation<T, E> {
    return this;
  }

  match<U>(pattern: { valid: (value: T) => U; invalid: (errors: E[]) => U }): U {
    return pattern.valid(this.value);
  }
}

export class Invalid<T, E> {
  readonly _tag: 'Invalid' = 'Invalid';

  constructor(private readonly errors: E[]) { }

  isValid(): this is Valid<T, E> {
    return false;
  }

  isInvalid(): this is Invalid<T, E> {
    return true;
  }

  unwrapErrors(): E[] {
    return this.errors;
  }

  map<U>(_fn: (value: T) => U): Validation<U, E> {
    return new Invalid(this.errors);
  }

  mapError<F>(fn: (errors: E[]) => F[]): Validation<T, F> {
    return new Invalid(fn(this.errors));
  }

  toResult(): Result<T, E[]> {
    return err(this.errors);
  }

  toOption(): Option<T> {
    return none();
  }

  and<U>(_other: Validation<U, E>): Validation<U, E> {
    return new Invalid(this.errors);
  }

  or(other: Validation<T, E>): Validation<T, E> {
    return other;
  }

  match<U>(pattern: { valid: (value: T) => U; invalid: (errors: E[]) => U }): U {
    return pattern.invalid(this.errors);
  }
}

// Helper functions
export function valid<T, E = Error>(value: T): Validation<T, E> {
  return new Valid(value);
}

export function invalid<T, E = Error>(...errors: E[]): Validation<T, E> {
  return new Invalid(errors);
}

// Type guards
export const isValid = <T, E>(validation: Validation<T, E>): validation is Valid<T, E> =>
  validation.isValid();

export const isInvalid = <T, E>(validation: Validation<T, E>): validation is Invalid<T, E> =>
  validation.isInvalid();

// Utility functions
export function combineValidations<T, E>(
  validations: Validation<T, E>[]
): Validation<T[], E> {
  const values: T[] = [];
  const errors: E[] = [];

  for (const validation of validations) {
    if (validation.isValid()) {
      values.push(validation.unwrap());
    } else {
      errors.push(...validation.unwrapErrors());
    }
  }

  return errors.length > 0 ? invalid(...errors) : valid(values);
}

// Additional utility functions
export function validateAll<T, E>(
  items: T[],
  validator: (item: T) => Validation<T, E>
): Validation<T[], E> {
  return combineValidations(items.map(validator));
}

export function fromResult<T, E>(result: Result<T, E>): Validation<T, E> {
  return result.match({
    ok: (value) => valid(value),
    err: (error) => invalid(error),
  });
}

export function fromOption<T, E>(option: Option<T>, error: E): Validation<T, E> {
  return option.match({
    some: (value) => valid(value),
    none: () => invalid(error),
  });
}
