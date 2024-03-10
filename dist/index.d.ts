declare class Debouncer {
    private uniqueRuns;
    run(func: () => any, signature?: Object, duration?: number): void;
    private cleanupRun;
    private encodeSignature;
}
declare const SignatureDebouncer: Debouncer;
export default SignatureDebouncer;
