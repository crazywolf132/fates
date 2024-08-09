import { type AsyncResult, err, ErrorType, ok, type Result } from "../result";

export function all<T extends any[], E>(results: {
    [K in keyof T]: Result<T[K], E> | AsyncResult<T[K], E>;
}): AsyncResult<T, E> {
    return Promise.all(
        results.map((r) => (r instanceof Promise ? r : Promise.resolve(r)))
    ).then((resolvedResults) => {
        const values: any[] = [];
        for (const result of resolvedResults) {
            if (result.isErr()) {
                return err(result.error);
            }
            values.push(result.value);
        }
        return ok(values as T);
    });
}

export function any<T, E>(
    results: (Result<T, E> | AsyncResult<T, E>)[]
): AsyncResult<T, E[]> {
    return Promise.all(
        results.map((r) => (r instanceof Promise ? r : Promise.resolve(r)))
    ).then((resolvedResults) => {
        const errors: E[] = [];
        for (const result of resolvedResults) {
            if (result.isOk()) {
                return ok(result.value);
            }
            errors.push(result.error);
        }
        return err(errors);
    });
}


/**
 * Combines an object of Results into a Result of an object.
 * @param obj An object with Result values
 * @returns A Result containing an object with the same shape as the input
 */
export function sequenceObject<T extends Record<string, Result<any, any>>>(
    obj: T
): AsyncResult<{ [K in keyof T]: T[K] extends Result<infer U, any> ? U : never }, ErrorType<T[keyof T]>> {
    const entries = Object.entries(obj);
    return Promise.all(entries.map(([_, result]) => result instanceof Promise ? result : Promise.resolve(result)))
        .then((resolvedResults) => {
            const values: any = {};
            for (let i = 0; i < entries.length; i++) {
                const [key, result] = entries[i];
                const resolvedResult = resolvedResults[i];
                if (resolvedResult.isErr()) {
                    return err(resolvedResult.error);
                }
                values[key] = resolvedResult.value;
            }
            return ok(values);
        });
}