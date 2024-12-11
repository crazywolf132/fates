import path from 'node:path';
import { type Option, type AsyncOption, none, some } from '../../option';
import { type AsyncResult, err } from '../../result';
import { readdir, stat } from '../fs';

/**
 * Create a normalized path
 */
export function normalize(value: string): string {
  return path.normalize(value.split(/[/\\]/).join(path.sep));
}

/**
 * Join path segments
 */
export function join(...segments: string[]): string {
  return path.join(...segments);
}

/**
 * Create absolute path
 */
export function absolute(...segments: string[]): string {
  return path.resolve(...segments);
}

/**
 * Get current working directory
 */
export function cwd(): string {
  return process.cwd();
}

/**
 * Get home directory
 */
export function home(): Option<string> {
  const home = process.env.HOME || process.env.USERPROFILE;
  return home ? some(home) : none();
}

/**
 * Get temp directory
 */
export function temp(): string {
  return path.resolve(process.env.TEMP || process.env.TMP || '/tmp');
}

/**
 * Check if path is absolute
 */
export function isAbsolute(p: string): boolean {
  return path.isAbsolute(p);
}

/**
 * Get relative path from source to target
 */
export function relative(from: string, to: string): string {
  return path.relative(from, to);
}

/**
 * Get parent directory
 */
export function parent(p: string): Option<string> {
  const parent = path.dirname(p);
  return parent !== p ? some(parent) : none();
}

/**
 * Get file name
 */
export function fileName(p: string): Option<string> {
  const base = path.basename(p);
  return base ? some(base) : none();
}

/**
 * Get file extension (without dot)
 */
export function extension(p: string): Option<string> {
  const ext = path.extname(p);
  return ext ? some(ext.slice(1)) : none();
}

/**
 * Change file extension
 */
export function withExtension(p: string, ext: string): string {
  const extName = ext.startsWith('.') ? ext : `.${ext}`;
  return path.format({
    ...path.parse(p),
    base: undefined,
    ext: extName
  });
}

/**
 * Check if one path contains another
 */
export function contains(parent: string, child: string): boolean {
  const rel = relative(parent, child);
  return !rel.startsWith('..') && !path.isAbsolute(rel);
}

/**
 * Get path parts
 */
export function parts(p: string): string[] {
  return p.split(path.sep).filter(Boolean);
}

/**
 * Create temporary path
 */
export function tempPath(prefix?: string): string {
  const random = Math.random().toString(36).slice(2);
  return join(temp(), `${prefix || 'tmp'}-${random}`);
}

/**
 * Find nearest file matching name up directory tree
 */
export async function findUp(
  filename: string,
  start: string = cwd()
): AsyncOption<string> {
  let current = absolute(start);

  while (true) {
    const filePath = join(current, filename);
    const statsOpt = await stat(filePath);

    if (statsOpt.isSome()) {
      return some(filePath);
    }

    const parentOpt = parent(current);
    if (parentOpt.isNone()) {
      return none();
    }

    current = parentOpt.unwrap();
  }
}

/**
 * Find all files matching pattern in directory
 */
export async function findFiles(
  dir: string,
  pattern: RegExp
): AsyncResult<string[], Error> {
  try {
    const entries = await readdir(dir);
    if (entries.isOk()) {
      return entries.map(files =>
        files.filter(file => pattern.test(file))
      );
    }
    return entries
  } catch (error) {
    return err(error instanceof Error ? error : new Error(String(error)));
  }
}

// Utility functions for common path operations
export const isDirectory = async (p: string): Promise<boolean> =>
  (await stat(p)).map(s => s.isDirectory()).unwrapOr(false);

export const isFile = async (p: string): Promise<boolean> =>
  (await stat(p)).map(s => s.isFile()).unwrapOr(false);

export const isSymlink = async (p: string): Promise<boolean> =>
  (await stat(p)).map(s => s.isSymbolicLink()).unwrapOr(false);
