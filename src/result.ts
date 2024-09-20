export class Ok<T> {
    readonly _tag = "Ok" as const;
    constructor(readonly value: T) {}

    isOk(): this is Ok<T> {
        return true;
    }
    isErr(): this is Err<never> {
        return false;
    }

    match(patterns: {
        ok: (value: T) => any;
        err: (error: never) => any;
    }): any {
        return patterns.ok(this.value);
    }

    map<U>(fn: (value: T) => U): Result<U, never> {
        return new Ok(fn(this.value));
    }

    flatMap<U, E>(fn: (value: T) => Result<U, E>): Result<U, E> {
        return fn(this.value);
    }

    chain<U>(fn: (value: T) => U): U {
        return fn(this.value);
    }

    mapErr<F>(_fn: (error: never) => F): Result<T, F> {
        return this as unknown as Result<T, F>;
    }

    unwrapOr(_defaultValue: T): T {
        return this.value;
    }

    unwrap(): T {
        return this.value;
    }

    safeUnwrap(): T {
        return this.value;
    }

    toPromise(): Promise<T> {
        return Promise.resolve(this.value);
    }
}

export class Err<E> {
    readonly _tag = "Err" as const;
    constructor(readonly error: E) {}

    isOk(): this is Ok<never> {
        return false;
    }
    isErr(): this is Err<E> {
        return true;
    }

    match(patterns: {
        ok: (value: never) => any;
        err: (error: E) => any;
    }): any {
        return patterns.err(this.error);
    }

    map<U>(_fn: (value: never) => U): Result<U, E> {
        return this as unknown as Result<U, E>;
    }

    flatMap<U, F>(_fn: (value: never) => Result<U, F>): Result<U, E> {
        return this as unknown as Result<U, E>;
    }

    chain<U>(_fn: (value: never) => U): Result<U, E> {
        return this as unknown as Result<U, E>;
    }

    mapErr<F>(fn: (error: E) => F): Result<never, F> {
        return new Err(fn(this.error));
    }

    unwrapOr<T>(defaultValue: T): T {
        return defaultValue;
    }

    unwrap(): never {
        throw this.error;
    }

    safeUnwrap(): E {
        return this.error;
    }

    toPromise(): Promise<never> {
        return Promise.reject(this.error);
    }
}

export type Result<T, E = Error> = Ok<T> | Err<E>;
export type AsyncResult<T, E = Error> = Promise<Result<T, E>>;
export type Option<T> = Ok<T> | Err<null>;

export type ResultType<T> = T extends Result<infer U> ? U : never;
export type AsyncResultType<T> = T extends AsyncResult<infer U> ? U : never;
export type ErrorType<T> = T extends Result<unknown, infer E> ? E : never;
export type AsyncErrorType<T> = T extends AsyncResult<unknown, infer E>
    ? E
    : never;

export type UnwrapOk<T> = T extends Ok<infer U> ? U : never;
export type UnwrapErr<E> = E extends Err<infer U> ? U : never;

export const ok = <T>(value: T): Ok<T> => new Ok(value);
export const err = <E>(error: E): Err<E> => new Err(error);
export const none: Option<never> = new Err(null);

export const isOk = <T, E>(result: Result<T, E>): result is Ok<T> =>
    result.isOk();
export const isErr = <T, E>(result: Result<T, E>): result is Err<E> =>
    result.isErr();

export * from "./utils";
