import { AsyncResult, err } from "../result";
import { ResultOrAsyncResult } from "./pipeline";

type RetryableFunction<T, E> = () => ResultOrAsyncResult<T, E>;

export function retry<T, E>(
    fn: RetryableFunction<T, E>,
    maxAttempts: number,
    delayMs: number
): AsyncResult<T, E> {
    return (async () => {
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            const result = await Promise.resolve(fn());
            if (result.isOk()) {
                return result;
            }
            if (attempt < maxAttempts) {
                await new Promise((resolve) => setTimeout(resolve, delayMs));
            }
        }
        return err(`Failed after ${maxAttempts} attempts` as any);
    })();
}
