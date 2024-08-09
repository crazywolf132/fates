import type { AsyncResult, Option, Result } from "../result";
import { err, none, ok } from "../result";
import { ResultOrAsyncResult } from "./pipeline";

export function fromNullable<T>(value: T | null | undefined): Option<T> {
  return value != null ? ok(value) : none;
}


export function tryCatch<T>(fn: () => T): Result<T, unknown>;
export function tryCatch<T>(fn: () => Promise<T>): AsyncResult<T, unknown>;
export function tryCatch<T>(fn: () => T | Promise<T>): Result<T, unknown> | AsyncResult<T, unknown> {
  try {
    const result = fn();
    if (result instanceof Promise) {
      return result.then(
        (value) => ok(value),
        (error) => err(error)
      );
    }
    return ok(result);
  } catch (error) {
    return err(error);
  }
}

export function mapResult<T, U, E>(
    result: Result<T, E>,
    fn: (value: T) => U
): Result<U, E>;
export function mapResult<T, U, E>(
    result: AsyncResult<T, E>,
    fn: (value: T) => U
): AsyncResult<U, E>;
export function mapResult<T, U, E>(
    result: ResultOrAsyncResult<T, E>,
    fn: (value: T) => U
): ResultOrAsyncResult<U, E> {
    if (result instanceof Promise) {
        return result.then((r) => r.map(fn));
    }
    return result.map(fn);
}
