"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SignatureDebouncer {
    constructor() {
        this.uniqueRuns = {};
    }
    /**
     * Debounce a function invocation, based on a provided signature and timeout duration.
     *
     * @param func the function to debounce
     * @param signature the signature the function debounces based off
     * @param duration the duration of the debounce in ms
     * @param options additional params
     */
    run(func, signature, duration, options = {}) {
        const encodedSignature = this.encodeSignature(signature);
        const existingTimeout = this.uniqueRuns[encodedSignature];
        // Reset the function timer due to untimely invocation
        if (existingTimeout) {
            clearTimeout(existingTimeout);
        }
        if (options.fireNow) {
            func();
            return;
        }
        this.uniqueRuns[encodedSignature] = setTimeout(() => {
            func();
            this.cleanupRun(encodedSignature);
        }, duration);
    }
    /**
     * Cancel any pending invocation for a provided debounce signature.
     *
     * @param signature the signature to cancel pending invocations for
     */
    cancel(signature) {
        const encodedSignature = this.encodeSignature(signature);
        this.cleanupRun(encodedSignature);
    }
    cleanupRun(encodedSignature) {
        let timeout = this.uniqueRuns[encodedSignature];
        if (timeout) {
            clearTimeout(timeout);
            delete this.uniqueRuns[encodedSignature];
        }
    }
    encodeSignature(signature) {
        return JSON.stringify(signature);
    }
}
const debouncer = new SignatureDebouncer();
exports.default = debouncer;
