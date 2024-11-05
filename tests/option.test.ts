import { some, none } from '../src/Option';

describe('Option', () => {
  test('Some should contain a value', () => {
    const value = some(5);
    expect(value.isSome()).toBe(true);
    expect(value.unwrap()).toBe(5);
  });

  test('None should not contain a value', () => {
    const value = none();
    expect(value.isNone()).toBe(true);
    expect(() => value.unwrap()).toThrow();
  });

  test('map should transform the value inside Some', () => {
    const value = some(5).map(x => x * 2);
    expect(value.unwrap()).toBe(10);
  });

  test('map on None should return None', () => {
    const value = none<number>().map(x => x * 2);
    expect(value.isNone()).toBe(true);
  });
});
