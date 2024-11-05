/**
 * Represents a value of one of two possible types.
 */
export type Either<L, R> = Left<L> | Right<R>;

export class Left<L> {
  readonly _tag: 'Left' = 'Left';

  constructor(private readonly value: L) { }

  isLeft(): this is Left<L> {
    return true;
  }

  isRight(): this is Right<never> {
    return false;
  }

  map<B>(_f: (r: never) => B): Either<L, B> {
    return this as Left<L>;
  }

  mapLeft<B>(f: (l: L) => B): Either<B, never> {
    return new Left(f(this.value));
  }

  fold<B>(onLeft: (l: L) => B, _onRight: (r: never) => B): B {
    return onLeft(this.value);
  }

  unwrap(): L {
    return this.value;
  }

  getOrElse<B>(defaultValue: B): B {
    return defaultValue;
  }

  chain<B>(_f: (r: never) => Either<L, B>): Either<L, B> {
    return this as Left<L>;
  }

  ap<B>(fab: Either<L, (a: never) => B>): Either<L, B> {
    return this as Left<L>;
  }
}

export class Right<R> {
  readonly _tag: 'Right' = 'Right';

  constructor(private readonly value: R) { }

  isLeft(): this is Left<never> {
    return false;
  }

  isRight(): this is Right<R> {
    return true;
  }

  map<B>(f: (r: R) => B): Either<never, B> {
    return new Right(f(this.value));
  }

  mapLeft<B>(_f: (l: never) => B): Either<B, R> {
    return this as Right<R>;
  }

  fold<B>(_onLeft: (l: never) => B, onRight: (r: R) => B): B {
    return onRight(this.value);
  }

  unwrap(): R {
    return this.value;
  }

  getOrElse<B>(_defaultValue: B): R {
    return this.value;
  }

  chain<B>(f: (r: R) => Either<never, B>): Either<never, B> {
    return f(this.value);
  }

  ap<A, B>(this: Right<(a: A) => B>, fa: Either<never, A>): Either<never, B> {
    return fa.map(this.value);
  }
}

// Helper functions
export const left = <L, R = never>(l: L): Either<L, R> => new Left(l);
export const right = <R, L = never>(r: R): Either<L, R> => new Right(r);

// Type guards
export const isLeft = <L, R>(either: Either<L, R>): either is Left<L> => either.isLeft();
export const isRight = <L, R>(either: Either<L, R>): either is Right<R> => either.isRight();

// Utility functions
export const tryCatch = <L, R>(f: () => R, onError: (error: unknown) => L): Either<L, R> => {
  try {
    return right(f());
  } catch (e) {
    return left(onError(e));
  }
};
