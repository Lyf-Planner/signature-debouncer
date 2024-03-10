class Debouncer {
  private uniqueRuns: Record<string, NodeJS.Timeout> = {};

  public run(func: () => any, signature: Object = {}, duration = 1000) {
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

  private cleanupRun(encodedSignature: any) {
    let timeout = this.uniqueRuns[encodedSignature];
    if (timeout) {
      clearTimeout(timeout);
      delete this.uniqueRuns[encodedSignature];
    }
  }

  private encodeSignature(signature: Object) {
    return JSON.stringify(signature);
  }
}

const SignatureDebouncer = new Debouncer();

export default SignatureDebouncer;
