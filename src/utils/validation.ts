import { type Result, ok, err } from "../result";

export const validate = <T, E>(
    value: T,
    predicate: (value: T) => boolean,
    errorValue: E
): Result<T, E> => (predicate(value) ? ok(value) : err(errorValue));

export const validateAll = <T, E>(
    value: T,
    validators: Array<(value: T) => Result<T, E>>
): Result<T, E> =>
    validators.reduce(
        (result, validator) => result.flatMap(validator),
        ok(value) as Result<T, E>
    );
