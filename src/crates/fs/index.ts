import fs from 'node:fs/promises';
import f from 'node:fs';
import { type AsyncResult, type Result, ok, err } from '../../result';
import { AsyncOption, some, none } from '../../option';

export interface FSError extends Error {
  code: string;
  message: string;
  path?: string;
};

/**
 * Read file contents asynchronously
 */
export async function readFile(
  path: string,
  encoding: BufferEncoding = 'utf-8'
): AsyncResult<string, FSError> {
  try {
    const content = await fs.readFile(path, { encoding });
    return ok(content);
  } catch (error) {
    return err(normalizeError(error));
  }
}

/**
 * Write content to file asynchronously
 */
export async function writeFile(
  path: string,
  data: string | Buffer
): AsyncResult<void, FSError> {
  try {
    await fs.writeFile(path, data);
    return ok(undefined);
  } catch (error) {
    return err(normalizeError(error));
  }
}

/**
 * Read and parse JSON file
 */
export async function readJSON<T>(path: string): AsyncResult<T, FSError> {
  const content = await readFile(path, 'utf-8');
  return content.andThen((text: string): Result<T, FSError> => {
    try {
      return ok(JSON.parse(text) as T);
    } catch (error) {
      return err(normalizeError(error))
    }
  });
}

/**
 * Write JSON to file
 */
export async function writeJSON<T>(
  path: string,
  data: T,
  pretty = true
): AsyncResult<void, FSError> {
  try {
    const content = JSON.stringify(data, null, pretty ? 2 : undefined);
    return writeFile(path, content);
  } catch (error) {
    return err(normalizeError(error));
  }
}

/**
 * Check if path exists
 */
export async function exists(path: string): AsyncResult<boolean, FSError> {
  try {
    await fs.access(path);
    return ok(true);
  } catch {
    return ok(false);
  }
}

/**
 * Get file stats if exists
 */
export async function stat(path: string): AsyncOption<f.Stats> {
  try {
    const stats = await fs.stat(path);
    return some(stats);
  } catch {
    return none();
  }
}

/**
 * Create directory recursively
 */
export async function mkdir(path: string): AsyncResult<void, FSError> {
  try {
    await fs.mkdir(path, { recursive: true });
    return ok(undefined);
  } catch (error) {
    return err(normalizeError(error));
  }
}

/**
 * Remove file or directory
 */
export async function remove(path: string): AsyncResult<void, FSError> {
  try {
    await fs.rm(path, { recursive: true, force: true });
    return ok(undefined);
  } catch (error) {
    return err(normalizeError(error));
  }
}

/**
 * Read directory contents
 */
export async function readdir(path: string): AsyncResult<string[], FSError> {
  try {
    const files = await fs.readdir(path);
    return ok(files);
  } catch (error) {
    return err(normalizeError(error));
  }
}

/**
 * Read directory contents recursively
 */
export async function readdirRecursive(path: string): AsyncResult<string[], FSError> {
  const files: string[] = [];

  async function walk(dir: string): Promise<Result<void, FSError>> {
    const entriesResult = await readdir(dir);

    if (entriesResult.isErr()) {
      return err(entriesResult.safeUnwrap());
    }

    for (const entry of entriesResult.unwrap()) {
      const fullPath = `${dir}/${entry}`;
      const statsOpt = await stat(fullPath);

      if (statsOpt.isSome()) {
        const stats = statsOpt.unwrap();
        if (stats.isDirectory()) {
          const walkResult = await walk(fullPath);
          if (walkResult.isErr()) {
            return walkResult;
          }
        } else {
          files.push(fullPath);
        }
      }
    }

    return ok(undefined);
  }

  const walkResult = await walk(path);
  return walkResult.isErr() ? err(walkResult.safeUnwrap()) : ok(files);
}

/**
 * Find files matching pattern
 */
export async function findFiles(
  path: string,
  pattern: RegExp
): AsyncResult<string[], FSError> {
  const allFilesResult = await readdirRecursive(path);
  return allFilesResult.map(files =>
    files.filter(file => pattern.test(file))
  );
}

function normalizeError(error: unknown): FSError {
  if (error instanceof Error) {
    return {
      name: 'FSError',
      code: (error as any).code || 'UNKNOWN_ERROR',
      message: error.message,
      path: (error as any).path
    };
  }
  return {
    name: 'FSError',
    code: 'UNKNOWN_ERROR',
    message: String(error)
  };
}
