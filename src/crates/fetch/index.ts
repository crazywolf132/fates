import { Result, Ok, ok, err } from '../../result';

export type FetchError = {
  type: 'network' | 'parse' | 'timeout' | 'abort';
  status?: number;
  message: string;
  body?: string;
};

interface FetchOptions extends RequestInit {
  timeout?: number;
  retry?: number;
  retryDelay?: number;
}

export class Http {
  constructor(private baseUrl: string = '', private defaultOptions: FetchOptions = {}) { }

  /**
   * Make a typed GET request
   */
  async get<T>(path: string, options: FetchOptions = {}): Promise<Result<T, FetchError>> {
    return this.request<T>(path, {
      ...options,
      method: 'GET'
    });
  }

  /**
   * Make a typed POST request
   */
  async post<T>(path: string, body?: any, options: FetchOptions = {}): Promise<Result<T, FetchError>> {
    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
  }

  /**
   * Make a typed PUT request
   */
  async put<T>(path: string, body?: any, options: FetchOptions = {}): Promise<Result<T, FetchError>> {
    return this.request<T>(path, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
  }

  /**
   * Make a typed DELETE request
   */
  async delete<T>(path: string, options: FetchOptions = {}): Promise<Result<T, FetchError>> {
    return this.request<T>(path, {
      ...options,
      method: 'DELETE'
    });
  }

  private async request<T>(path: string, options: FetchOptions): Promise<Result<T, FetchError>> {
    const url = this.baseUrl + path;
    const mergedOptions = { ...this.defaultOptions, ...options };
    const { timeout, retry = 0, retryDelay = 1000, ...fetchOptions } = mergedOptions;

    let lastError: FetchError;

    for (let attempt = 0; attempt <= retry; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = timeout ? setTimeout(() => controller.abort(), timeout) : null;

        const response = await fetch(url, {
          ...fetchOptions,
          signal: controller.signal
        });

        if (timeoutId) clearTimeout(timeoutId);

        if (!response.ok) {
          const error: FetchError = {
            type: 'network',
            status: response.status,
            message: response.statusText,
            body: await response.text()
          };
          throw error;
        }

        const data = await response.json();
        return ok(data);
      } catch (error) {
        lastError = {
          type: error instanceof Error ?
            error.name === 'AbortError' ? 'timeout' : 'network'
            : 'network',
          message: String(error)
        };

        if (attempt < retry) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          continue;
        }
      }
    }

    return err(lastError!);
  }
}

// Utility functions for error checking
export const isNetworkError = (error: FetchError): boolean =>
  error.type === 'network';

export const isTimeoutError = (error: FetchError): boolean =>
  error.type === 'timeout';

export const isParseError = (error: FetchError): boolean =>
  error.type === 'parse';

export const isAbortError = (error: FetchError): boolean =>
  error.type === 'abort';

// Type guards for response types
export const isSuccessResponse = <T>(response: Result<T, FetchError>): response is Ok<T, FetchError> =>
  response.isOk();

// Utility functions for common response handling
export const withBearerToken = (token: string): RequestInit => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
});

export const withJson = (data: unknown): RequestInit => ({
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
});

// Response transformers
export const asText = async (response: Response): Promise<Result<string, FetchError>> => {
  try {
    const text = await response.text();
    return ok(text);
  } catch (error) {
    return err({
      type: 'parse',
      message: 'Failed to parse response as text',
      status: response.status
    });
  }
};

export const asJson = async <T>(response: Response): Promise<Result<T, FetchError>> => {
  try {
    const json = await response.json();
    return ok(json);
  } catch (error) {
    return err({
      type: 'parse',
      message: 'Failed to parse response as JSON',
      status: response.status
    });
  }
};
