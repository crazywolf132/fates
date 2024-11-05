import { type AsyncResult, ok, type Result } from '../result/result';

export type ResultOrAsyncResult<T, E> = Result<T, E> | AsyncResult<T, E>;

export function pipeline<T, E>(...fns: ((value: T) => ResultOrAsyncResult<T, E>)[]): (initialValue: T) => AsyncResult<T, E> {
  return async (initialValue: T) => {
    let result: Result<T, E> = ok(initialValue);

    for (const fn of fns) {
      if (result.isErr()) {
        return result;
      }

      let nextResult: ResultOrAsyncResult<T, E>;
      if (result.isErr()) {
        nextResult = fn(result.safeUnwrap())
      } else {
        nextResult = fn(result.safeUnwrap())
      }

      if (nextResult instanceof Promise) {
        result = await nextResult;
      } else {
        result = nextResult;
      }
    }

    return result;
  };
}
