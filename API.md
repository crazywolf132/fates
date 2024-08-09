# Fates API Reference

## Core Types

```typescript
type Result<T, E = Error> = Ok<T> | Err<E>;
type AsyncResult<T, E = Error> = Promise<Result<T, E>>;
type Option<T> = Ok<T> | Err<null>;
```

## Core Functions

- `ok<T>(value: T): Ok<T>`: Creates a success result.
- `err<E>(error: E): Err<E>`: Creates a failure result.
- `isOk<T, E>(result: Result<T, E>): result is Ok<T>`: Type guard for Ok results.
- `isErr<T, E>(result: Result<T, E>): result is Err<E>`: Type guard for Err results.

## Utility Functions

- `chain<T, U, E>(fn: (value: T) => Result<U, E>)`: Chains operations that return Results.
- `map<T, U>(fn: (value: T) => U)`: Transforms the success value of a Result.
- `tap<T>(fn: (value: T) => void)`: Performs a side effect on the success value.
- `recover<T, E>(result: Result<T, E>, fallback: T | ((error: E) => T))`: Provides a fallback for Err results.
- `mapError<T, E, F>(result: Result<T, E>, fn: (error: E) => F)`: Transforms the error value of a Result.
- `fromNullable<T>(value: T | null | undefined): Option<T>`: Creates an Option from a nullable value.
- `tryCatch<T>(fn: () => T): Result<T, unknown>`: Wraps a function that might throw in a Result.
- `tryCatch<T>(fn: () => Promise<T>): AsyncResult<T, unknown>`: Wraps an async function that might throw in an AsyncResult.

## Async Utilities

- `fromPromise<T>(promise: Promise<T>): AsyncResult<T, unknown>`: Converts a Promise to an AsyncResult.
- `withTimeout<T, E>(asyncResult: AsyncResult<T, E>, timeoutMs: number): AsyncResult<T, E | Error>`: Adds a timeout to an AsyncResult.
- `flattenAsyncResult<T, E>(asyncResult: AsyncResult<AsyncResult<T, E>, E>): AsyncResult<T, E>`: Flattens a nested AsyncResult.
- `asyncMap<T, U, E>(asyncResult: AsyncResult<T, E>, fn: (value: T) => U): AsyncResult<U, E>`: Maps over an AsyncResult.
- `asyncFlatMap<T, U, E, F>(asyncResult: AsyncResult<T, E>, fn: (value: T) => AsyncResult<U, F>): AsyncResult<U, E | F>`: FlatMaps over an AsyncResult.

## Parsing

- `parseNumber(value: string): Result<number, string>`: Parses a string to a number.
- `parseDate(value: string): Result<Date, string>`: Parses a string to a Date.
- `parseJSON<T>(value: string): Result<T, string>`: Parses a JSON string to an object.

## Validation

- `validate<T, E>(value: T, predicate: (value: T) => boolean, errorValue: E): Result<T, E>`: Validates a value against a predicate.
- `validateAll<T, E>(value: T, validators: Array<(value: T) => Result<T, E>>): Result<T, E>`: Applies multiple validators to a value.

## Combinators

- `all<T extends any[], E>(results: { [K in keyof T]: Result<T[K], E> | AsyncResult<T[K], E> }): AsyncResult<T, E>`: Combines multiple Results into one.
- `any<T, E>(results: (Result<T, E> | AsyncResult<T, E>)[]): AsyncResult<T, E[]>`: Returns the first successful Result.
- `sequenceObject<T extends Record<string, Result<any, any>>>(obj: T): AsyncResult<...>`: Combines an object of Results into a Result of an object.

## Pipeline

- `pipeline<T, E>(...fns: ((value: T) => ResultOrAsyncResult<T, E>)[]): (initialValue: T) => AsyncResult<T, E>`: Creates a processing pipeline.

## Retry

- `retry<T, E>(fn: RetryableFunction<T, E>, maxAttempts: number, delayMs: number): AsyncResult<T, E>`: Retries an operation multiple times.