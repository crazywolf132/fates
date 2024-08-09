import { type Result, ok, isErr } from "../result";

export type ResultTuple<T extends any[], E> = {
    [K in keyof T]: Result<T[K], E>;
};

export function combine<T extends any[], E>(
    results: ResultTuple<T, E>
): Result<T, E> {
    const values: any[] = [];
    for (const result of results) {
        if (isErr(result)) {
            return result;
        }
        values.push(result.value);
    }
    return ok(values as T);
}
