import { Option, isSome, isNone } from '../../option';
import { Result, isOk, isErr } from '../../result';
import { Validation } from '../../validation';

/**
 * Assert that a condition is true
 * @throws AssertionError if condition is false
 */
export function assert(condition: boolean, message?: string): asserts condition {
  if (!condition) {
    throw new AssertionError(message ?? 'Assertion failed');
  }
}

/**
 * Custom error class for assertion failures
 */
export class AssertionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AssertionError';
  }
}

/**
 * Assert that a value is defined (not null or undefined)
 * @throws AssertionError if value is null or undefined
 */
export function assertDefined<T>(value: T | null | undefined, message?: string): asserts value is T {
  assert(value != null, message ?? 'Expected value to be defined');
}

/**
 * Assert that an Option is Some and return its value
 * @throws AssertionError if Option is None
 */
export function assertSome<T>(option: Option<T>, message?: string): T {
  assert(isSome(option), message ?? 'Expected Option to be Some');
  return option.unwrap();
}

/**
 * Assert that an Option is None
 * @throws AssertionError if Option is Some
 */
export function assertNone<T>(option: Option<T>, message?: string): void {
  assert(isNone(option), message ?? 'Expected Option to be None');
}

/**
 * Assert that a Result is Ok and return its value
 * @throws AssertionError if Result is Err
 */
export function assertOk<T, E>(result: Result<T, E>, message?: string): T {
  assert(isOk(result), message ?? `Expected Result to be Ok, got Err: ${String(result)}`);
  return result.unwrap();
}

/**
 * Assert that a Result is Err and return its error
 * @throws AssertionError if Result is Ok
 */
export function assertErr<T, E>(result: Result<T, E>, message?: string): E {
  assert(isErr(result), message ?? 'Expected Result to be Err');
  return (result as any).safeUnwrap();
}

/**
 * Assert that a value matches a type predicate
 * @throws AssertionError if value doesn't match predicate
 */
export function assertType<T>(
  value: unknown,
  predicate: (value: unknown) => value is T,
  message?: string
): asserts value is T {
  assert(predicate(value), message ?? 'Value does not match expected type');
}

/**
 * Assert that a value is an instance of a class
 * @throws AssertionError if value is not an instance of class
 */
export function assertInstanceOf<T>(
  value: unknown,
  constructor: new (...args: any[]) => T,
  message?: string
): asserts value is T {
  assert(
    value instanceof constructor,
    message ?? `Expected value to be instance of ${constructor.name}`
  );
}

/**
 * Assert that a value is a string
 * @throws AssertionError if value is not a string
 */
export function assertString(value: unknown, message?: string): asserts value is string {
  assert(typeof value === 'string', message ?? 'Expected value to be string');
}

/**
 * Assert that a value is a number
 * @throws AssertionError if value is not a number
 */
export function assertNumber(value: unknown, message?: string): asserts value is number {
  assert(typeof value === 'number' && !isNaN(value), message ?? 'Expected value to be number');
}

/**
 * Assert that a value is a boolean
 * @throws AssertionError if value is not a boolean
 */
export function assertBoolean(value: unknown, message?: string): asserts value is boolean {
  assert(typeof value === 'boolean', message ?? 'Expected value to be boolean');
}

/**
 * Assert that an array has a specific length
 * @throws AssertionError if array length doesn't match
 */
export function assertLength<T>(arr: ArrayLike<T>, length: number, message?: string): void {
  assert(
    arr.length === length,
    message ?? `Expected array to have length ${length}, got ${arr.length}`
  );
}

/**
 * Assert that a string matches a regular expression
 * @throws AssertionError if string doesn't match regex
 */
export function assertMatches(value: string, regex: RegExp, message?: string): void {
  assert(regex.test(value), message ?? `Expected string to match ${regex}`);
}

/**
 * Assert that two values are strictly equal
 * @throws AssertionError if values are not strictly equal
 */
export function assertEqual<T>(actual: T, expected: T, message?: string): void {
  assert(
    actual === expected,
    message ?? `Expected values to be equal: ${actual} !== ${expected}`
  );
}

/**
 * Assert that two values are not strictly equal
 * @throws AssertionError if values are strictly equal
 */
export function assertNotEqual<T>(actual: T, unexpected: T, message?: string): void {
  assert(
    actual !== unexpected,
    message ?? `Expected values to be different, both are ${actual}`
  );
}

/**
 * Assert that a number is greater than another
 * @throws AssertionError if first number is not greater than second
 */
export function assertGreaterThan(value: number, other: number, message?: string): void {
  assert(
    value > other,
    message ?? `Expected ${value} to be greater than ${other}`
  );
}

/**
 * Assert that a number is less than another
 * @throws AssertionError if first number is not less than second
 */
export function assertLessThan(value: number, other: number, message?: string): void {
  assert(
    value < other,
    message ?? `Expected ${value} to be less than ${other}`
  );
}

/**
 * Assert that a value is within a range (inclusive)
 * @throws AssertionError if value is outside range
 */
export function assertInRange(value: number, min: number, max: number, message?: string): void {
  assert(
    value >= min && value <= max,
    message ?? `Expected ${value} to be between ${min} and ${max}`
  );
}

/**
 * Assert that a promise resolves
 * @throws AssertionError if promise rejects
 */
export async function assertResolves<T>(promise: Promise<T>, message?: string): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    throw new AssertionError(message ?? `Expected promise to resolve, but it rejected with: ${error}`);
  }
}

/**
 * Assert that a promise rejects
 * @throws AssertionError if promise resolves
 */
export async function assertRejects<T>(promise: Promise<T>, message?: string): Promise<Error> {
  try {
    await promise;
    throw new AssertionError(message ?? 'Expected promise to reject, but it resolved');
  } catch (error) {
    if (error instanceof AssertionError) {
      throw error;
    }
    return error instanceof Error ? error : new Error(String(error));
  }
}

/**
 * Assert that a validation is valid
 * @throws AssertionError if validation is invalid
 */
export function assertValid<T, E>(validation: Validation<T, E>, message?: string): T {
  assert(validation.isValid(), message ?? 'Expected validation to be valid');
  return validation.unwrap();
}

/**
 * Assert that a validation is invalid
 * @throws AssertionError if validation is valid
 */
export function assertInvalid<T, E>(validation: Validation<T, E>, message?: string): E[] {
  assert(validation.isInvalid(), message ?? 'Expected validation to be invalid');
  return (validation as any).unwrapErrors();
}

/**
 * Assert that an error has a specific message
 * @throws AssertionError if error message doesn't match
 */
export function assertErrorMessage(error: Error, message: string): void {
  assertEqual(error.message, message, 'Error message does not match expected message');
}
