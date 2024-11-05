import { useEffect, useState } from 'react';
import { Option, some, none } from '../../option';
import { Result, ok, err } from '../../result';

/**
 * Hook for async operations that returns Option<T>
 */
export function useOptional<T>(
  asyncFn: () => Promise<T | null | undefined>,
  deps: any[] = []
): [Option<T>, boolean, Error | null] {
  const [state, setState] = useState<Option<T>>(none());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await asyncFn();
        if (mounted) {
          setState(result != null ? some(result) : none());
          setError(null);
        }
      } catch (e) {
        if (mounted) {
          setState(none());
          setError(e instanceof Error ? e : new Error(String(e)));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, deps);

  return [state, loading, error];
}

/**
 * Hook for async operations that returns Result<T, E>
 */
export function useResult<T, E = Error>(
  asyncFn: () => Promise<T>,
  deps: any[] = []
): [Result<T, E>, boolean] {
  const [state, setState] = useState<Result<T, E>>(err('Not initialized' as any));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await asyncFn();
        if (mounted) {
          setState(ok(result));
        }
      } catch (e) {
        if (mounted) {
          setState(err(e as E));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, deps);

  return [state, loading];
}

// Components for handling Option/Result rendering
export interface MatchProps<T> {
  value: Option<T>;
  some: (value: T) => React.ReactNode;
  none: () => React.ReactNode;
}

export function Match<T>({ value, some, none }: MatchProps<T>) {
  return <>{ value.isSome() ? some(value.unwrap()) : none() } </>;
}

export interface ResultMatchProps<T, E> {
  value: Result<T, E>;
  ok: (value: T) => React.ReactNode;
  err: (error: E) => React.ReactNode;
}

export function ResultMatch<T, E>({ value, ok, err }: ResultMatchProps<T, E>) {
  return <>{ value.isOk() ? ok(value.unwrap()) : err(value.safeUnwrap() as E) } </>;
}
