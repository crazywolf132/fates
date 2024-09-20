# Fates 🔮 - Tame Your TypeScript Destiny!

Hey there, fellow coder! 👋 Tired of wrestling with unpredictable outcomes in your TypeScript projects? Say hello to Fates, your new best friend in the battle against uncertainty!

[![npm version](https://badge.fury.io/js/fates.svg)](https://badge.fury.io/js/fates)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

## Table of Contents

- [Introduction](#introduction)
- [Key Features](#key-features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Core Concepts](#core-concepts)
  - [The Result Type](#the-result-type)
  - [Ok and Err](#ok-and-err)
  - [Essential Methods](#essential-methods)
- [Advanced Usage](#advanced-usage)
  - [Async Operations](#async-operations)
  - [Chaining and Composition](#chaining-and-composition)
  - [Error Recovery and Transformation](#error-recovery-and-transformation)
  - [Validation Pipelines](#validation-pipelines)
  - [Parsing and Type Conversion](#parsing-and-type-conversion)
  - [Combining Results](#combining-results)
  - [Processing Pipelines](#processing-pipelines)
  - [Retry Mechanisms](#retry-mechanisms)
- [API Reference](#api-reference)
- [Best Practices and Patterns](#best-practices-and-patterns)
- [Performance Considerations](#performance-considerations)
- [Migrating from Try-Catch](#migrating-from-try-catch)
- [Comparison with Other Libraries](#comparison-with-other-libraries)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Fates is a powerful TypeScript library that revolutionizes error handling and data flow management. By introducing a `Result` type inspired by functional programming paradigms, Fates enables developers to write more predictable, maintainable, and expressive code.

## Key Features

- 🛡️ **Type-Safe Error Handling**: Leverage TypeScript's type system for robust error management.
- 🔗 **Elegant Function Composition**: Chain operations seamlessly, even with potential failures.
- 🚀 **First-Class Async Support**: Handle asynchronous operations with grace and predictability.
- 🧰 **Comprehensive Utility Set**: A rich collection of tools for manipulating and transforming Results.
- 🏗️ **Flexible Validation Framework**: Construct complex, reusable validation pipelines with ease.
- 🔄 **Built-in Retry Mechanism**: Handle transient failures in distributed systems effortlessly.
- 🧩 **Powerful Combinators**: Combine and manipulate multiple Results with intuitive operators.

## Installation

Choose your preferred package manager:

```bash
npm install fates
# or
yarn add fates
# or
pnpm add fates
```

## Quick Start

Let's dive into a simple example to see Fates in action:

```typescript
import { ok, err, Result } from 'fates';

function divideAndFormatCurrency(a: number, b: number): Result<string, string> {
  if (b === 0) return err("Division by zero");
  const result = a / b;
  return ok(`$${result.toFixed(2)}`);
}

const result = divideAndFormatCurrency(100, 3);

result.match({
  ok: (value) => console.log(`Formatted result: ${value}`),
  err: (error) => console.log(`Error occurred: ${error}`),
});
// Output: Formatted result: $33.33
```

## Core Concepts

### The Result Type

The foundation of Fates is the `Result` type:

```typescript
type Result<T, E = Error> = Ok<T> | Err<E>;
```

It encapsulates either a success value (`Ok<T>`) or a failure value (`Err<E>`).

### The Option Type

Fates also provides an `Option` type for representing values that may or may not exist:

```typescript
type Option<T> = Ok<T> | Err<null>;
```

The `Option` type is useful for handling nullable values without resorting to null checks:

```typescript
import { fromNullable, Option } from 'fates';

function findUser(id: number): Option<User> {
  const user = database.getUser(id);
  return fromNullable(user);
}

const userOption = findUser(1);
userOption.match({
  ok: (user) => console.log(`Found user: ${user.name}`),
  err: () => console.log("User not found"),
});
```

### Ok and Err

Create success and failure results:

```typescript
import { ok, err } from 'fates';

const success = ok(42);
const failure = err("Something went wrong");

console.log(success.isOk());  // true
console.log(failure.isErr()); // true
```

### Essential Methods

Both `Ok` and `Err` provide powerful methods for working with results:

#### match

Pattern match on the result:

```typescript
result.match({
  ok: (value) => console.log(`Success: ${value}`),
  err: (error) => console.log(`Error: ${error}`),
});
```

#### map and flatMap

Transform success values:

```typescript
const doubled = ok(21).map(x => x * 2);  // Ok(42)
const maybeSquared = doubled.flatMap(x => x > 50 ? err("Too large") : ok(x * x));  // Err("Too large")
```

#### mapErr

Transform error values:

```typescript
const newError = err("error").mapErr(e => new Error(e));  // Err(Error("error"))
```

#### unwrap and unwrapOr

Extract values (with caution):

```typescript
const value = ok(42).unwrap();  // 42
const fallback = err("error").unwrapOr(0);  // 0
```

#### safeUnwrap

Extract raw values regardless of error

``` typescript
const value ok(41).safeUnwrap(); // 41
const fallback = err("error").safeUnwrap(); // "error"
const badfallback = err("some error").unwrap(); // Throws "some error"
```

## Advanced Usage

### Async Operations

Fates seamlessly integrates with asynchronous code:

```typescript
import { fromPromise, AsyncResult } from 'fates';

async function fetchUserData(id: number): AsyncResult<User, Error> {
  return fromPromise(fetch(`https://api.example.com/users/${id}`).then(res => res.json()));
}

const result = await fetchUserData(1);
result.match({
  ok: (user) => console.log(`Welcome, ${user.name}!`),
  err: (error) => console.log(`Fetch failed: ${error.message}`),
});
```

### Chaining and Composition

Elegantly chain operations that might fail:

```typescript
import { chain } from 'fates';

const getUser = (id: number): Result<User, Error> => { /* ... */ };
const getUserPosts = (user: User): Result<Post[], Error> => { /* ... */ };
const formatPosts = (posts: Post[]): Result<string, Error> => { /* ... */ };

const formattedUserPosts = getUser(1)
  .flatMap(chain(getUserPosts))
  .flatMap(chain(formatPosts));

formattedUserPosts.match({
  ok: (formatted) => console.log(formatted),
  err: (error) => console.error(`Error: ${error.message}`),
});
```

### Error Recovery and Transformation

Gracefully handle and transform errors:

```typescript
import { recover, mapError } from 'fates';

const result = getUserData(1)
  .mapErr(error => `Failed to fetch user: ${error.message}`)
  .recover(error => ({ id: 0, name: 'Guest' }));

console.log(result.unwrap());  // Either user data or the guest user
```

### Validation Pipelines

Build complex, reusable validation logic:

```typescript
import { validate, validateAll } from 'fates';

const validateAge = (age: number) => validate(age, a => a >= 18, "Must be an adult");
const validateEmail = (email: string) => validate(email, e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e), "Invalid email");

const validateUser = (user: { age: number, email: string }) =>
  validateAll(user, [
    u => validateAge(u.age),
    u => validateEmail(u.email)
  ]);

const result = validateUser({ age: 25, email: "alice@example.com" });
result.match({
  ok: (user) => console.log(`Valid user: ${JSON.stringify(user)}`),
  err: (error) => console.error(`Validation failed: ${error}`),
});
```

### Parsing and Type Conversion

Safely parse and convert data:

```typescript
import { parseNumber, parseDate, parseJSON } from 'fates';

const num = parseNumber("42").unwrapOr(0);
const date = parseDate("2023-04-01").unwrapOr(new Date());
const config = parseJSON<Config>(jsonString).unwrapOr(defaultConfig);
```

### Combining Results

Work with multiple results simultaneously:

```typescript
import { all, any, sequenceObject } from 'fates';

const results = all([fetchUser(1), fetchPosts(1), fetchComments(1)]);
results.match({
  ok: ([user, posts, comments]) => console.log(`Fetched data for ${user.name}`),
  err: (error) => console.error(`One or more fetches failed: ${error}`),
});

const firstSuccess = any([unreliableServiceA(), unreliableServiceB(), unreliableServiceC()]);
firstSuccess.match({
  ok: (result) => console.log(`Got a successful result: ${result}`),
  err: (errors) => console.error(`All services failed: ${errors.join(', ')}`),
});

const userResult = sequenceObject({
  name: validateName(formData.name),
  email: validateEmail(formData.email),
  age: validateAge(formData.age)
});
```

### Processing Pipelines

Create robust data processing flows:

```typescript
import { pipeline } from 'fates';

const processOrder = pipeline(
  validateOrder,
  calculateTotalWithTax,
  applyDiscount,
  saveToDatabase,
  sendConfirmationEmail
);

const result = await processOrder(orderData);
result.match({
  ok: (confirmationId) => console.log(`Order processed, confirmation: ${confirmationId}`),
  err: (error) => console.error(`Order processing failed: ${error}`),
});
```

### Retry Mechanisms

Handle transient failures in distributed systems:

```typescript
import { retry } from 'fates';

const fetchWithRetry = retry(
  () => fetchFromUnreliableService(),
  3,  // max attempts
  1000  // delay between attempts (ms)
);

const result = await fetchWithRetry();
result.match({
  ok: (data) => console.log(`Fetched successfully: ${data}`),
  err: (error) => console.error(`All attempts failed: ${error}`),
});
```

## API Reference

For a complete API reference, please visit our [API Documentation](https://github.com/crazywolf132/fates/blob/main/API.md).

## Best Practices and Patterns

- Prefer `flatMap` over `map` when chaining operations that return `Result`.
- Use `tap` for side effects without changing the `Result` value.
- Leverage `validateAll` for complex object validations.
- Use `AsyncResult` consistently for asynchronous operations.
- Prefer `recover` over `unwrapOr` for more flexible error handling.

## Performance Considerations

Fates is designed with performance in mind, but here are some tips to optimize your use:

- Avoid unnecessary `map` and `flatMap` chains when a single operation would suffice.
- Use `AsyncResult` directly instead of wrapping `Promise<Result<T, E>>`.
- Leverage `all` and `any` for parallel operations instead of sequential `flatMap` chains.

## Migrating from Try-Catch

Fates offers a more expressive and type-safe alternative to traditional try-catch blocks. Here's a quick comparison:

```typescript
// Traditional try-catch
try {
  const result = riskyOperation();
  console.log(result);
} catch (error) {
  console.error(error);
}

// With Fates
riskyOperation()
  .match({
    ok: (result) => console.log(result),
    err: (error) => console.error(error),
  });
```

## Comparison with Other Libraries

Fates draws inspiration from functional programming concepts and libraries like Rust's `Result` type. However, it's tailored specifically for TypeScript, offering seamless integration with async/await and providing a rich set of utilities designed for real-world TypeScript applications.

## Contributing

We welcome contributions to Fates! Whether you're fixing bugs, adding features, or improving documentation, your help is appreciated. Please check our [Contribution Guidelines](https://github.com/crazywolf132/fates/blob/main/CONTRIBUTING.md) for more information.

## License

Fates is licensed under the ISC License. See the [LICENSE](https://github.com/crazywolf132/fates/blob/main/LICENSE) file for details.

---

Embrace the power of Fates and elevate your TypeScript projects to new heights of reliability and expressiveness!
