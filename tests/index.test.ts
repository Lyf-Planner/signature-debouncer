import debouncer from "../src/index";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const signature = "this is an example of a signature, it is arbitrary data!";
const duration = 1000;

describe("Signature Debouncer", () => {
  it("invokes function only after timeout", async () => {
    const array: string[] = [];
    const func = () => array.push("Test!");

    debouncer.run(func, signature, duration);
    expect(array).toEqual([]);

    await sleep(duration);
    expect(array).toEqual(["Test!"]);
  });

  it("clears previous invocations once executed", async () => {
    const array: string[] = [];
    const func = () => array.push("Test!");

    debouncer.run(func, signature, duration);
    expect(array).toEqual([]);

    await sleep(duration);
    expect(array).toEqual(["Test!"]);

    debouncer.run(func, signature, duration);
    await sleep(duration);
    expect(array).toEqual(["Test!", "Test!"]);
  });

  it("debounces multiple invocations within the timeout duration", async () => {
    const array: string[] = [];
    const func = () => array.push("Test!");

    debouncer.run(func, signature, duration);
    debouncer.run(func, signature, duration);
    debouncer.run(func, signature, duration);
    expect(array).toEqual([]);

    await sleep(duration);
    expect(array).toEqual(["Test!"]);
  });

  it("treats different signatures as seperate invocations", async () => {
    const array: string[] = [];
    const func = () => array.push("Test!");

    debouncer.run(func, signature, duration);
    debouncer.run(func, { key: "this is a different signature" }, duration);
    expect(array).toEqual([]);

    await sleep(duration);
    expect(array).toEqual(["Test!", "Test!"]);
  });

  it("debounces based on the signature and not the function", async () => {
    const array: string[] = [];
    const func = () => array.push("Test!");
    const anotherFunc = () => array.push("Test Again???");

    debouncer.run(func, signature, duration);
    debouncer.run(anotherFunc, signature, duration);
    expect(array).toEqual([]);

    await sleep(duration);
    expect(array).toEqual(["Test Again???"]);
  });

  it("prevents the invocation when cancel is called", async () => {
    const array: string[] = [];
    const func = () => array.push("Test!");

    debouncer.run(func, signature, duration);
    expect(array).toEqual([]);

    debouncer.cancel(signature);
    await sleep(duration);
    expect(array).toEqual([]);
  });

  it("runs immediately if the fireNow option is passed", async () => {
    const array: string[] = [];
    const func = () => array.push("Test!");

    debouncer.run(func, signature, duration);
    expect(array).toEqual([]);

    debouncer.run(func, signature, duration, { fireNow: true })
    expect(array).toEqual(["Test!"]);
  });
});
