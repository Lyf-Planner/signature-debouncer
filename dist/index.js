"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Debouncer {
    constructor() {
        this.uniqueRuns = {};
    }
    run(func, signature = {}, duration = 1000) {
        const encodedSignature = this.encodeSignature(signature);
        const timeout = this.uniqueRuns[encodedSignature];
        // Reset the function timer due to untimely invocation
        if (timeout) {
            clearTimeout(timeout);
        }
        this.uniqueRuns[encodedSignature] = setTimeout(() => {
            func();
            this.cleanupRun(encodedSignature);
        }, duration);
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
const SignatureDebouncer = new Debouncer();
exports.default = SignatureDebouncer;
