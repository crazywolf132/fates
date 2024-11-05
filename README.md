# Fates 🔮 - Tame Your TypeScript Destiny

Hey there, fellow coder! 👋 Tired of wrestling with unpredictable outcomes in your TypeScript projects? Say hello to Fates, your new best friend in the battle against uncertainty!

[![npm version](https://badge.fury.io/js/fates.svg)](https://badge.fury.io/js/fates)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

## Table of Contents

1. [Installation](#installation)
2. [Getting Started](#getting-started)
   - [Basic Usage](#basic-usage)
   - [Working with Results](#working-with-results)
   - [Handling Edge Cases](#handling-edge-cases)
3. [Core Concepts](#core-concepts)
   - [Result Type](#result-type)
   - [Option Type](#option-type)
   - [Either Type](#either-type)
4. [Available Crates](#available-crates)
5. [Advanced Usage](#advanced-usage)
   - [Async Operations](#async-operations)
   - [Chaining and Composition](#chaining-and-composition)
   - [Error Recovery](#error-recovery)
   - [Validation Pipelines](#validation-pipelines)
   - [Data Processing](#data-processing)
   - [Retry Mechanisms](#retry-mechanisms)
   - [Combining Results](#combining-results)
6. [Best Practices](#best-practices)
7. [Performance Considerations](#performance-considerations)
8. [Migration Guide](#migration-guide)
9. [Library Comparison](#library-comparison)
10. [API Reference](#api-reference)

## Installation

```bash
npm install fates
# or
yarn add fates
# or
pnpm add fates
```

## Getting Started

### Basic Usage

Fates makes error handling intuitive and type-safe:

```typescript
import { ok, err, type Result } from 'fates';

// Results use Error as the default error type
function divide(a: number, b: number): Result<number> {
  if (b === 0) return err(new Error("Division by zero"));
  return ok(a / b);
}

// Pattern matching for clean error handling
divide(10, 2).match({
  ok: result => console.log(`Result: ${result}`),
  err: error => console.log(`Error: ${error.message}`)
});
```

### Working with Results

Chain operations safely and handle errors gracefully:

```typescript
const result = divide(10, 2)
  .map(value => value * 2)
  .flatMap(value => validateNumber(value))
  .mapErr(error => new ValidationError(error.message));

// Provide fallback values
const safeResult = result.unwrapOr(0);

// Transform errors
const handled = result.mapErr(error => {
  logError(error);
  return new UserFacingError("Calculation failed");
});
```

### Handling Edge Cases

Working with boolean Results requires special attention:

```typescript
function checkUserAccess(userId: string): Result<boolean> {
  try {
    const hasAccess = /* check access */;
    return ok(hasAccess);
  } catch (error) {
    return err(error instanceof Error ? error : new Error(String(error)));
  }
}

// ✅ Correct usage with pattern matching
const accessResult = checkUserAccess("user-123");
accessResult.match({
  ok: hasAccess => hasAccess ? grantAccess() : denyAccess(),
  err: error => handleError(error)
});

// ✅ Alternative using map
const accessStatus = await checkUserAccess("user-123")
  .map(hasAccess => hasAccess ? "granted" : "denied")
  .unwrapOr("error");
```

## Core Concepts

### Result Type

`Result<T, E = Error>` represents an operation that can fail:

```typescript
// Error type defaults to Error if not specified
function findUser(id: string): Result<User> {
  try {
    const user = db.find(id);
    return user ? ok(user) : err(new Error("User not found"));
  } catch (error) {
    return err(error instanceof Error ? error : new Error(String(error)));
  }
}

// Custom error type
function validateAge(age: number): Result<number, ValidationError> {
  return age >= 0 ? ok(age) : err(new ValidationError("Age must be positive"));
}
```

### Option Type

`Option<T>` handles nullable values elegantly:

```typescript
import { some, none, type Option } from 'fates';

function findFirst<T>(arr: T[], predicate: (value: T) => boolean): Option<T> {
  const value = arr.find(predicate);
  return value ? some(value) : none();
}

// Chain operations safely
const result = findFirst([1, 2, 3], x => x > 2)
  .map(x => x * 2)
  .filter(x => x < 10)
  .unwrapOr(0);
```

### Either Type

`Either<L, R>` represents values with two possible types:

```typescript
import { left, right, type Either } from 'fates';

type ValidationErrors = string[];
type ConfigData = { port: number; host: string };

function parseConfig(input: string): Either<ValidationErrors, ConfigData> {
  const errors = validateConfig(input);
  return errors.length > 0 
    ? left(errors)
    : right(parseValidConfig(input));
}

// Usage with pattern matching
parseConfig(configString).match({
  left: errors => console.error("Validation failed:", errors),
  right: config => startServer(config)
});
```

## Available Crates

Fates provides specialized modules for common tasks. Each crate is independently importable for optimal tree-shaking:

- [Assert](./API.md#assert-module) - Type-safe assertions and runtime checks
- [Cache](./API.md#cache-module) - Simple, flexible caching with TTL support
- [Error](./API.md#error-module) - Enhanced error types with metadata
- [Events](./API.md#events-module) - Type-safe event handling
- [Fetch](./API.md#fetch-module) - HTTP client with Result returns
- [FileSystem](./API.md#filesystem-module) - Safe filesystem operations
- [Path](./API.md#path-module) - Path manipulation utilities
- [Rate Limiter](./API.md#rate-limiter-module) - Request rate control
- [React](./API.md#react-module) - React hooks and components

Example using multiple crates:

```typescript
import { Http } from 'fates/fetch';
import { RateLimiter } from 'fates/rate-limiter';
import { assertDefined } from 'fates/assert';

const api = new Http('https://api.example.com');
const limiter = new RateLimiter({ 
  interval: 1000,
  maxRequests: 10 
});

async function fetchUser(id: string) {
  assertDefined(id, "User ID must be defined");
  
  if (!limiter.tryAcquire()) {
    return err(new Error("Rate limit exceeded"));
  }
  
  return await api.get<User>(`/users/${id}`);
}
```

## Advanced Usage

### Async Operations

Handle asynchronous operations elegantly:

```typescript
import { type AsyncResult, tryAsync } from 'fates';

async function processUserData(id: string): AsyncResult<ProcessedData> {
  return tryAsync(async () => {
    const user = await fetchUser(id);
    const validated = await validateUser(user);
    return await processData(validated);
  });
}

// Chain async operations
const result = await processUserData("123")
  .then(result => result
    .map(enrichData)
    .mapErr(error => new ProcessingError(error)));
```

### Chaining and Composition

Build complex operations from simple ones:

```typescript
const validateUser = (user: User): Result<User> =>
  validateName(user)
    .flatMap(validateAge)
    .flatMap(validateEmail)
    .map(enrichUserData);

// Compose functions that return Results
const processUser = chain(
  validateUser,
  updateDatabase,
  notifyUser
);
```

### Error Recovery

Implement sophisticated error handling:

```typescript
const result = await fetchUser(id)
  .then(result => result
    .orElse(error => {
      if (error instanceof NotFoundError) {
        return fetchUserFromBackup(id);
      }
      return err(error);
    })
    .mapErr(error => {
      logError(error);
      return new UserFacingError("Could not fetch user");
    }));
```

### Validation Pipelines

Create reusable validation chains:

```typescript
import { Validation, valid, invalid } from 'fates/validation';

const validateUsername = (input: string): Validation<string> => {
  if (input.length < 3) return invalid("Too short");
  if (input.length > 20) return invalid("Too long");
  if (!/^[a-zA-Z0-9_]+$/.test(input)) return invalid("Invalid characters");
  return valid(input);
};

const validateUser = (user: unknown): Validation<User> =>
  validateUsername(user.username)
    .flatMap(username => validateEmail(user.email)
      .map(email => ({ username, email })));
```

### Data Processing

Build robust data processing pipelines:

```typescript
import { pipeline } from 'fates/utils';

const processOrder = pipeline(
  validateOrder,
  enrichWithUserData,
  calculateTotals,
  applyDiscounts,
  saveToDatabase,
  notifyCustomer
);

const result = await processOrder(orderData);
```

### Retry Mechanisms

Handle transient failures:

```typescript
import { retry } from 'fates/utils';

const fetchWithRetry = retry(
  () => api.get('/unstable-endpoint'),
  {
    maxAttempts: 3,
    delay: 1000,
    backoff: 2
  }
);

const result = await fetchWithRetry();
```

### Combining Results

Work with multiple Results:

```typescript
import { all, any } from 'fates/utils';

// Wait for all operations to succeed
const results = await all([
  fetchUser(id),
  fetchOrders(id),
  fetchPreferences(id)
]);

// Use first successful result
const backup = await any([
  primaryDB.fetch(id),
  secondaryDB.fetch(id),
  tertiaryDB.fetch(id)
]);
```

## Best Practices

### Do's ✅

```typescript
// Use pattern matching for exhaustive handling
result.match({
  ok: value => handleSuccess(value),
  err: error => handleError(error)
});

// Chain operations safely
option
  .map(transform)
  .flatMap(validate);

// Handle errors explicitly
result.mapErr(error => new ApplicationError(error));

// Use type guards
if (result.isOk()) {
  // TypeScript knows result is Ok<T>
}
```

### Don'ts ❌

```typescript
// Don't access .value directly
result.value // ❌ Never do this!

// Don't use unwrap without protection
result.unwrap() // ❌ Could throw!

// Don't ignore error cases
result.map(value => transform(value)) // ❌ Error case ignored

// Don't mix with null/undefined
function findUser(): User | null // ❌ Use Option<User>
```

## Performance Considerations

- Results and Options are lightweight wrappers with minimal overhead
- Method chaining creates new instances; batch operations when possible
- Use `match` for pattern matching - it's optimized and type-safe
- Async operations leverage native Promises for optimal performance
- Tree-shaking friendly - only pay for what you use
- Crates are independently importable for minimal bundle size

## Migration Guide

### From try-catch

Before:

```typescript
try {
  const user = await fetchUser(id);
  const validated = validateUser(user);
  return processUser(validated);
} catch (error) {
  handleError(error);
  return defaultUser;
}
```

After:

```typescript
const result = await fetchUser(id)
  .then(result => result
    .flatMap(validateUser)
    .flatMap(processUser)
    .unwrapOr(defaultUser));
```

### From Nullable Values

Before:

```typescript
function findUser(id: string): User | null {
  const user = users.get(id);
  return user ?? null;
}
```

After:

```typescript
function findUser(id: string): Option<User> {
  const user = users.get(id);
  return user ? some(user) : none();
}
```

## Library Comparison

- **fp-ts**: Complete FP toolkit, steeper learning curve
- **neverthrow**: Similar approach, fewer features
- **ts-results**: Basic Result type only
- **Option-T**: Focused on Option type
- **Fates**:
  - Comprehensive but approachable
  - Rich utility functions
  - Strong TypeScript integration
  - Modular architecture
  - First-class async support
  - React integration
  - Wide range of utility crates

## API Reference

For detailed API documentation, see [API.md](./API.md).

## License

ISC License - see [LICENSE](LICENSE) for details.

---

Ready to tame uncertainty in your TypeScript projects? Get started with Fates today!

```bash
npm install fates
```
