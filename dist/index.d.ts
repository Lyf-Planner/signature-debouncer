export type DebounceOptions = {
    fireNow?: boolean;
};
declare class SignatureDebouncer {
    private uniqueRuns;
    /**
     * Debounce a function invocation, based on a provided signature and timeout duration.
     *
     * @param func the function to debounce
     * @param signature the signature the function debounces based off
     * @param duration the duration of the debounce in ms
     * @param options additional params
     */
    run(func: () => void, signature: Object, duration: number, options?: DebounceOptions): void;
    /**
     * Cancel any pending invocation for a provided debounce signature.
     *
     * @param signature the signature to cancel pending invocations for
     */
    cancel(signature: Object): void;
    private cleanupRun;
    private encodeSignature;
}
declare const debouncer: SignatureDebouncer;
export default debouncer;
