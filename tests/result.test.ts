import { ok, err } from '../src/Result';

describe('Result', () => {
  test('Ok should contain a value', () => {
    const value = ok(5);
    expect(value.isOk()).toBe(true);
    expect(value.unwrap()).toBe(5);
  });

  test('Err should contain an error', () => {
    const error = new Error('Something went wrong');
    const value = err<number, Error>(error);
    expect(value.isErr()).toBe(true);
    expect(() => value.unwrap()).toThrow();
  });

  test('map should transform the value inside Ok', () => {
    const value = ok(5).map(x => x * 2);
    expect(value.unwrap()).toBe(10);
  });

  test('map on Err should return Err', () => {
    const error = new Error('Something went wrong');
    const value = err<number, Error>(error).map(x => x * 2);
    expect(value.isErr()).toBe(true);
  });
});
