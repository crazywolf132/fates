import { Err, Ok, type AsyncResult, type ErrorType, type Result } from "../result";

export function chain<T, U, E>(fn: (value: T) => Result<U, E>) {
    return <R extends Result<T, E> | AsyncResult<T, E>>(
        result: R
    ): R extends AsyncResult<T, E> ? AsyncResult<U, E> : Result<U, E> => {
        if (result instanceof Promise) {
            return result.then((r) => r.flatMap(fn)) as any;
        }
        return result.flatMap(fn) as any;
    };
}

/**
 * Applies a function to each element of an array of Results.
 * @param results An array of Results
 * @param fn A function to apply to each Result's value
 * @returns A Result containing an array of the mapped values
 */
export function map<T, U>(fn: (value: T) => U) {
    return <R extends Result<T, any> | AsyncResult<T, any>>(
        result: R
    ): R extends AsyncResult<T, any>
        ? AsyncResult<U, ErrorType<R>>
        : Result<U, ErrorType<R>> => {
        if (result instanceof Promise) {
            return result.then((r) => r.map(fn)) as any;
        }
        return result.map(fn) as any;
    };
}

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

/**
 * Converts a Promise to an AsyncResult.
 * @param promise The input Promise
 * @returns An AsyncResult
 */
export function fromPromise<T>(promise: Promise<T>): AsyncResult<T, unknown> {
  return promise.then(
    (value) => new Ok(value),
    (error) => new Err(error)
  );
}
