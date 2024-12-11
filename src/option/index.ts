import { None } from './none';
import { Option } from './option';
import { Some } from './some';

export const isSome = <T>(opt: Option<T>): opt is Some<T> => opt.isSome();
export const isNone = <T>(opt: Option<T>): opt is None => opt.isNone();

export * from './none';
export * from './option';
export * from './some';

