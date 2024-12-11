export function chain<T>(...fns: Array<(arg: T) => T>): (arg: T) => T {
  return (arg: T) => fns.reduce((prev, fn) => fn(prev), arg)
}
