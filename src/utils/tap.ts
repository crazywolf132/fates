import type { Result, AsyncResult } from '../result/result';

/**
 * Applies a side effect function to the value of an Ok result.
 * @param result The input Result
 * @param fn The side effect function
 * @returns The original Result
 */
export function tap<T>(fn: (value: T) => void) {
  return <R extends Result<T, any> | AsyncResult<T, any>>(result: R): R => {
    if (result instanceof Promise) {
      return result.then((r) =>
        r.match({
          ok: (value) => {
            fn(value);
            return r;
          },
          err: () => r,
        })
      ) as any;
    }
    return result.match({
      ok: (value) => {
        fn(value);
        return result;
      },
      err: () => result,
    }) as any;
  };
}
