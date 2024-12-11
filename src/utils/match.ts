export function match<T extends object, R>(
  value: T,
  patterns: { [K in keyof T]?: (value: T[K]) => R },
  defaultCase: () => R
): R {
  for (const key in patterns) {
    if (key in value) {
      return patterns[key as keyof T]!(value[key as keyof T]);
    }
  }
  return defaultCase();
}
