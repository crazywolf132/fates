import { type Result, ok, err } from '../result';

export const parseNumber = (value: string): Result<number, string> => {
  const num = Number(value);
  return isNaN(num) ? err(`Invalid number: ${value}`) : ok(num);
}

export const parseDate = (value: string): Result<Date, string> => {
  const date = new Date(value);
  return isNaN(date.getTime()) ? err(`Invalid date: ${value}`) : ok(date);
}

export const parseJSON = <T>(value: string): Result<T, string> => {
  try {
    return ok(JSON.parse(value));
  } catch (error) {
    return err(
      `Invalid JSON: ${error instanceof Error ? error.message : String(error)
      }`
    )
  }
}
