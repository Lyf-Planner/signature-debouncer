"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignatureDebouncer = void 0;
class SignatureDebouncer {
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
exports.SignatureDebouncer = SignatureDebouncer;
const debouncer = new SignatureDebouncer();
exports.default = debouncer;
