import { type AsyncResult, Err, Ok, type Result } from "../result";

export function isResult<T, E>(value: any): value is Result<T, E> {
    return value instanceof Ok || value instanceof Err;
}

export function isAsyncResult<T, E>(value: any): value is AsyncResult<T, E> {
  return value instanceof Promise;
}

export function toAsync<T, E>(result: Result<T, E>): AsyncResult<T, E> {
    return Promise.resolve(result);
}

export function fromAsync<T, E>(
    asyncResult: AsyncResult<T, E>
): Promise<Result<T, E>> {
    return asyncResult;
}

/**
 * Provides a fallback value for an Err result.
 * @param result The input Result
 * @param fallback The fallback value or function
 * @returns The original value if Ok, or the fallback value if Err
 */
export function recover<T, E>(
  result: Result<T, E>,
  fallback: T | ((error: E) => T)
): Result<T, never> {
  if (result.isOk()) {
    return result;
  }
  const fallbackValue = typeof fallback === 'function' ? (fallback as (error: E) => T)(result.error) : fallback;
  return new Ok(fallbackValue);
}

/**
 * Transforms an Err value while leaving Ok values unchanged.
 * @param result The input Result
 * @param fn The function to transform the error
 * @returns A new Result with the error transformed
 */
export function mapError<T, E, F>(
  result: Result<T, E>,
  fn: (error: E) => F
): Result<T, F> {
  return result.isOk() ? result : new Err(fn(result.error));
}
