export declare class SignatureDebouncer {
    private uniqueRuns;
    run(func: () => any, signature?: Object, duration?: number): void;
    private cleanupRun;
    private encodeSignature;
}
declare const debouncer: SignatureDebouncer;
export default debouncer;
