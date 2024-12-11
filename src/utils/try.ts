import { type Result, err, ok } from '../result';
/**
 * Creates a new Result by running a fallible function
 * @example
 * tryFn(() => JSON.parse('{"a": 1}')) // ok({a: 1})
 * tryFn(() => JSON.parse('invalid')) // err(SyntaxError)
 */
export function tryFn<T>(fn: () => T): Result<T, Error> {
  try {
    return ok(fn());
  } catch (error) {
    return err(error instanceof Error ? error : new Error(String(error)));
  }
}

export async function tryAsync<T>(fn: () => Promise<T>): Promise<Result<T, Error>> {
  try {
    return ok(await fn());
  } catch (error) {
    return err(error instanceof Error ? error : new Error(String(error)));
  }
}
