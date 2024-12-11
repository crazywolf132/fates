# Fates API Reference

## Table of Contents

- [Core Types](#core-types)
- [Core Functions](#core-functions)
- [Utility Functions](#utility-functions)
- [Assert Module](#assert-module)
- [Cache Module](#cache-module)
- [Error Module](#error-module)
- [Events Module](#events-module)
- [Fetch Module](#fetch-module)
- [FileSystem Module](#filesystem-module)
- [Path Module](#path-module)
- [Rate Limiter Module](#rate-limiter-module)
- [React Module](#react-module)

## Core Types

### Result<T, E>

```typescript
type Result<T, E = Error> = Ok<T, E> | Err<T, E>;

interface Result<T, E> {
  isOk(): this is Ok<T, E>;
  isErr(): this is Err<T, E>;
  map<U>(fn: (value: T) => U): Result<U, E>;
  mapErr<F>(fn: (error: E) => F): Result<T, F>;
  unwrap(): T;
  unwrapOr(defaultValue: T): T;
  safeUnwrap(): T | E;
  match<U>(pattern: { 
    ok: (value: T) => U; 
    err: (error: E) => U 
  }): U;
  and<U>(result: Result<U, E>): Result<U, E>;
  or(result: Result<T, E>): Result<T, E>;
  andThen<U>(fn: (value: T) => Result<U, E>): Result<U, E>;
  orElse<F>(fn: (error: E) => Result<T, F>): Result<T, F>;
  unwrapOrElse(fn: (error: E) => T): T;
  transpose<U>(this: Result<Option<U>, E>): Option<Result<U, E>>;
  zip<U>(other: Result<U, E>): Result<[T, U], E>;
}

type AsyncResult<T, E = Error> = Promise<Result<T, E>>;
```

### Option<T>

```typescript
type Option<T> = Some<T> | None;

interface Option<T> {
  isSome(): this is Some<T>;
  isNone(): this is None;
  map<U>(fn: (value: T) => U): Option<U>;
  unwrap(): T;
  unwrapOr<U>(defaultValue: U): T | U;
  match<U>(pattern: {
    some: (value: T) => U;
    none: () => U;
  }): U;
  and<U>(option: Option<U>): Option<U>;
  or(option: Option<T>): Option<T>;
  andThen<U>(fn: (value: T) => Option<U>): Option<U>;
  orElse(fn: () => Option<T>): Option<T>;
  filter(predicate: (value: T) => boolean): Option<T>;
  unwrapOrElse(fn: () => T): T;
  flatten<U>(this: Option<Option<U>>): Option<U>;
  zip<U>(other: Option<U>): Option<[T, U]>;
  contains(predicate: (value: T) => boolean): boolean;
}

type AsyncOption<T> = Promise<Option<T>>;
```

## Core Functions

### Result Creation and Handling

```typescript
function ok<T, E = never>(value: T): Result<T, E>;
function err<T = never, E = Error>(error: E): Result<T, E>;
function isOk<T, E>(result: Result<T, E>): result is Ok<T, E>;
function isErr<T, E>(result: Result<T, E>): result is Err<T, E>;
```

### Option Creation and Handling

```typescript
function some<T>(value: T): Option<T>;
function none<T>(): Option<T>;
function isSome<T>(opt: Option<T>): opt is Some<T>;
function isNone<T>(opt: Option<T>): opt is None;
```

## Utility Functions

### Error Handling

```typescript
function tryFn<T>(fn: () => T): Result<T, Error>;
function tryAsync<T>(fn: () => Promise<T>): Promise<Result<T, Error>>;
```

### Data Processing

```typescript
function chain<T>(...fns: Array<(arg: T) => T>): (arg: T) => T;
function collect<T>(options: Option<T>[]): Option<T[]>;
function combine<T extends any[], E>(results: ResultTuple<T, E>): Result<T, E>;
```

### Parsing

```typescript
function parseNumber(value: string): Result<number, string>;
function parseDate(value: string): Result<Date, string>;
function parseJSON<T>(value: string): Result<T, string>;
```

## Assert Module

```typescript
import { ... } from 'fates/assert';

function assert(condition: boolean, message?: string): asserts condition;
function assertDefined<T>(value: T | null | undefined, message?: string): asserts value is T;
function assertSome<T>(option: Option<T>, message?: string): T;
function assertNone<T>(option: Option<T>, message?: string): void;
function assertOk<T, E>(result: Result<T, E>, message?: string): T;
function assertErr<T, E>(result: Result<T, E>, message?: string): E;
function assertType<T>(value: unknown, predicate: (value: unknown) => value is T, message?: string): asserts value is T;
function assertInstanceOf<T>(value: unknown, constructor: new (...args: any[]) => T, message?: string): asserts value is T;
function assertString(value: unknown, message?: string): asserts value is string;
function assertNumber(value: unknown, message?: string): asserts value is number;
function assertBoolean(value: unknown, message?: string): asserts value is boolean;
function assertLength<T>(arr: ArrayLike<T>, length: number, message?: string): void;
function assertMatches(value: string, regex: RegExp, message?: string): void;
function assertEqual<T>(actual: T, expected: T, message?: string): void;
function assertNotEqual<T>(actual: T, unexpected: T, message?: string): void;
function assertGreaterThan(value: number, other: number, message?: string): void;
function assertLessThan(value: number, other: number, message?: string): void;
function assertInRange(value: number, min: number, max: number, message?: string): void;
function assertResolves<T>(promise: Promise<T>, message?: string): Promise<T>;
function assertRejects<T>(promise: Promise<T>, message?: string): Promise<Error>;
```

## Cache Module

```typescript
import { ... } from 'fates/cache';

interface CacheOptions {
  maxSize?: number;
  ttl?: number;
}

class Cache<K, V> {
  constructor(options?: CacheOptions);
  set(key: K, value: V): void;
  get(key: K): V | undefined;
  has(key: K): boolean;
  delete(key: K): void;
  clear(): void;
  size(): number;
}
```

## Error Module

```typescript
import { ... } from 'fates/error';

interface ErrorMetadata {
  code?: string;
  status?: number;
  [key: string]: unknown;
}

class BaseError extends Error {
  public readonly name: string;
  public readonly cause?: Error;
  public readonly metadata: ErrorMetadata;
  public readonly timestamp: Date;

  constructor(options: {
    message: string;
    name?: string;
    cause?: Error;
    metadata?: ErrorMetadata;
  });

  withMetadata(metadata: ErrorMetadata): this;
  toResult<T>(): Result<T, this>;
  getRootCause(): Error;
  getCause<E extends Error>(): Option<E>;
  toJSON(): Record<string, unknown>;
  toErrorChain(): string;
}

// Error Type Creation
function createErrorType<T extends ErrorMetadata = ErrorMetadata>(
  name: string,
  defaultMetadata?: Partial<T>
): new (message: string, metadata?: T, cause?: Error) => BaseError;

// Common Error Types
class ValidationError extends BaseError {
  constructor(message: string, metadata?: {
    code: string;
    field?: string;
    constraint?: string;
  }, cause?: Error);
  static isInstance(error: unknown): error is ValidationError;
}

class NotFoundError extends BaseError {
  constructor(message: string, metadata?: {
    code: string;
    resource: string;
    id?: string | number;
  }, cause?: Error);
  static isInstance(error: unknown): error is NotFoundError;
}

class TimeoutError extends BaseError {
  constructor(message: string, metadata?: {
    code: string;
    timeout: number;
  }, cause?: Error);
  static isInstance(error: unknown): error is TimeoutError;
}
```

## Events Module

```typescript
import { ... } from 'fates/events';

type EventMap = Record<string | symbol, any>;
type EventKey<T extends EventMap> = string & keyof T;
type EventCallback<T> = (arg: T) => void;
type UnsubscribeFn = () => void;

class TypedEventEmitter<T extends EventMap> {
  constructor();
  
  // Properties
  maxListeners: number;
  static defaultMaxListeners: number;
  
  // Methods
  on<K extends EventKey<T>>(event: K, callback: EventCallback<T[K]>): UnsubscribeFn;
  once<K extends EventKey<T>>(event: K, callback: EventCallback<T[K]>): UnsubscribeFn;
  off<K extends EventKey<T>>(event: K, callback: EventCallback<T[K]>): void;
  emit<K extends EventKey<T>>(event: K, arg: T[K]): boolean;
  onMany<K extends EventKey<T>>(events: K[], callback: EventCallback<T[K]>): UnsubscribeFn;
  listenerCount<K extends EventKey<T>>(event: K): number;
  hasListeners<K extends EventKey<T>>(event: K): boolean;
  eventNames(): Array<keyof T>;
  removeAllListeners<K extends EventKey<T>>(event?: K): void;
  setMaxListeners(n: number): void;
  waitFor<K extends EventKey<T>>(event: K): Promise<T[K]>;
}
```

## Fetch Module

```typescript
import { ... } from 'fates/fetch';

interface FetchOptions extends RequestInit {
  timeout?: number;
  retry?: number;
  retryDelay?: number;
}

type FetchError = {
  type: 'network' | 'parse' | 'timeout' | 'abort';
  status?: number;
  message: string;
  body?: string;
};

class Http {
  constructor(baseUrl?: string, defaultOptions?: FetchOptions);
  
  get<T>(path: string, options?: FetchOptions): Promise<Result<T, FetchError>>;
  post<T>(path: string, body?: any, options?: FetchOptions): Promise<Result<T, FetchError>>;
  put<T>(path: string, body?: any, options?: FetchOptions): Promise<Result<T, FetchError>>;
  delete<T>(path: string, options?: FetchOptions): Promise<Result<T, FetchError>>;
}

// Utility Functions
function isNetworkError(error: FetchError): boolean;
function isTimeoutError(error: FetchError): boolean;
function isParseError(error: FetchError): boolean;
function isAbortError(error: FetchError): boolean;
function withBearerToken(token: string): RequestInit;
function withJson(data: unknown): RequestInit;
function asText(response: Response): Promise<Result<string, FetchError>>;
function asJson<T>(response: Response): Promise<Result<T, FetchError>>;
```

## FileSystem Module

```typescript
import { ... } from 'fates/fs';

interface FSError extends Error {
  code: string;
  message: string;
  path?: string;
}

// Core Operations
function readFile(path: string, encoding?: BufferEncoding): AsyncResult<string, FSError>;
function writeFile(path: string, data: string | Buffer): AsyncResult<void, FSError>;
function readJSON<T>(path: string): AsyncResult<T, FSError>;
function writeJSON<T>(path: string, data: T, pretty?: boolean): AsyncResult<void, FSError>;
function exists(path: string): AsyncResult<boolean, FSError>;
function stat(path: string): AsyncOption<Stats>;
function mkdir(path: string): AsyncResult<void, FSError>;
function remove(path: string): AsyncResult<void, FSError>;
function readdir(path: string): AsyncResult<string[], FSError>;
function readdirRecursive(path: string): AsyncResult<string[], FSError>;
function findFiles(path: string, pattern: RegExp): AsyncResult<string[], FSError>;
```

## Path Module

```typescript
import { ... } from 'fates/path';

// Path Operations
function normalize(value: string): string;
function join(...segments: string[]): string;
function absolute(...segments: string[]): string;
function cwd(): string;
function home(): Option<string>;
function temp(): string;
function isAbsolute(p: string): boolean;
function relative(from: string, to: string): string;
function parent(p: string): Option<string>;
function fileName(p: string): Option<string>;
function extension(p: string): Option<string>;
function withExtension(p: string, ext: string): string;
function contains(parent: string, child: string): boolean;
function parts(p: string): string[];
function tempPath(prefix?: string): string;
function findUp(filename: string, start?: string): AsyncOption<string>;
function findFiles(dir: string, pattern: RegExp): AsyncResult<string[], Error>;
function isDirectory(p: string): Promise<boolean>;
function isFile(p: string): Promise<boolean>;
function isSymlink(p: string): Promise<boolean>;
```

## Rate Limiter Module

```typescript
import { ... } from 'fates/rate-limiter';

interface RateLimiterOptions {
  interval: number;  // Time window in ms
  maxRequests: number;  // Max requests per interval
}

class RateLimiter {
  constructor(options: RateLimiterOptions);
  tryAcquire(): boolean;
  remaining(): number;
  reset(): void;
}
```

## React Module

```typescript
import { ... } from 'fates/react';

// Hooks
function useOptional<T>(
  asyncFn: () => Promise<T | null | undefined>,
  deps?: any[]
): [Option<T>, boolean, Error | null];

function useResult<T, E = Error>(
  asyncFn: () => Promise<T>,
  deps?: any[]
): [Result<T, E>, boolean];

// Components
interface MatchProps<T> {
  value: Option<T>;
  some: (value: T) => React.ReactNode;
  none: () => React.ReactNode;
}

function Match<T>(props: MatchProps<T>): JSX.Element;

interface ResultMatchProps<T, E> {
  value: Result<T, E>;
  ok: (value: T) => React.ReactNode;
  err: (error: E) => React.ReactNode;
}

function ResultMatch<T, E>(props: ResultMatchProps<T, E>): JSX.Element;
```

## Type Utilities

```typescript
// Result Types
type ResultTuple<T extends any[], E> = {
  [K in keyof T]: Result<T[K], E>;
};

type ResultOrAsyncResult<T, E> = Result<T, E> | AsyncResult<T, E>;

// Option Types
type OptionTuple<T extends any[]> = {
  [K in keyof T]: Option<T[K]>;
};

// Event Types
type EventMap = Record<string | symbol, any>;
type EventKey<T extends EventMap> = string & keyof T;
type EventCallback<T> = (arg: T) => void;
```

## Best Practices

### Do's ✅

- Always handle both Ok and Err cases using `match`
- Use Option for nullable values
- Chain operations with `map` and `flatMap`
- Handle async operations with AsyncResult
- Use appropriate crates for specific functionality
- Implement proper error recovery strategies
- Use type guards when narrowing types

### Don'ts ❌

- Avoid using `unwrap` without error handling
- Don't mix Result with try/catch when possible
- Don't ignore the None case in Options
- Avoid type casting when working with Results
- Don't use null/undefined when Option is more appropriate
- Don't expose internal error details to users
- Avoid mixing sync and async Result operations
