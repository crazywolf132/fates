import { none, some, type Option } from '../option';
/**
 * Collects an array of Options into an Option of array
 * @example
 * collect([some(1), some(2), some(3)]) // some([1, 2, 3])
 * collect([some(1), none(), some(3)]) // none()
 */
export function collect<T>(options: Option<T>[]): Option<T[]> {
  const results: T[] = [];
  for (const opt of options) {
    if (opt.isNone()) {
      return none();
    }
    results.push(opt.unwrap());
  }
  return some(results);
}
