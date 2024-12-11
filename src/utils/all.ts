import type { Result, AsyncResult } from "../result";
import { ok } from "../result";

/**
 * Combines multiple Results or AsyncResults into a single AsyncResult.
 * Returns Ok only if all Results are Ok, otherwise returns the first Err encountered.
 * Similar to Promise.all but for Results.
 */
export function all<T extends any[], E>(results: {
    [K in keyof T]: Result<T[K], E> | AsyncResult<T[K], E>;
  }): AsyncResult<T, E> {
    return Promise.all(
      results.map((r) => (r instanceof Promise ? r : Promise.resolve(r)))
    ).then((resolvedResults) => {
      const values: any[] = [];
      for (const result of resolvedResults) {
        if (result.isErr()) {
          return result as Result<T, E>;
        }
        values.push(result.unwrap());
      }
      return ok(values as T);
    });
  }