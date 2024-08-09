import { type AsyncResult, type Result, err, ok } from "../result";

export async function* mapAsyncIterator<T, U, E>(
    iterator: AsyncIterableIterator<T>,
    fn: (value: T) => AsyncResult<U, E>
): AsyncIterableIterator<Result<U, E>> {
    for await (const value of iterator) {
        yield await fn(value);
    }
}

export async function collectAsyncResults<T, E>(
    iterator: AsyncIterableIterator<Result<T, E>>
): AsyncResult<T[], E> {
    const results: T[] = [];
    for await (const result of iterator) {
        if (result.isErr()) {
            return err(result.error);
        }
        results.push(result.value);
    }
    return ok(results);
}

export function withTimeout<T, E>(
    asyncResult: AsyncResult<T, E>,
    timeoutMs: number
): AsyncResult<T, E | Error> {
    return new Promise((resolve) => {
        const timeoutId = setTimeout(() => {
            resolve(err(new Error(`Operation timed out after ${timeoutMs}ms`)));
        }, timeoutMs);

        asyncResult.then((result) => {
            clearTimeout(timeoutId);
            resolve(result);
        });
    });
}

/**
 * Flattens a nested AsyncResult.
 * @param asyncResult An AsyncResult that may contain another AsyncResult
 * @returns A flattened AsyncResult
 */
export function flattenAsyncResult<T, E>(
    asyncResult: AsyncResult<AsyncResult<T, E>, E>
): AsyncResult<T, E> {
    return asyncResult.then(result => 
        result.match({
            ok: innerResult => innerResult,
            err: error => err(error)
        })
    );
}

/**
 * Applies a function to the value of an AsyncResult.
 * @param asyncResult The input AsyncResult
 * @param fn The function to apply
 * @returns A new AsyncResult with the function applied to the value
 */
export function asyncMap<T, U, E>(
  asyncResult: AsyncResult<T, E>,
  fn: (value: T) => U
): AsyncResult<U, E> {
  return asyncResult.then((result) => result.map(fn));
}

/**
 * Applies an async function to the value of an AsyncResult.
 * @param asyncResult The input AsyncResult
 * @param fn The async function to apply
 * @returns A new AsyncResult with the async function applied to the value
 */
export function asyncFlatMap<T, U, E, F>(
  asyncResult: AsyncResult<T, E>,
  fn: (value: T) => AsyncResult<U, F>
): AsyncResult<U, E | F> {
  return asyncResult.then((result) => 
    result.match({
      ok: (value) => fn(value),
      err: (error) => err(error)
    })
  );
}