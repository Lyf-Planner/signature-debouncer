import debouncer from "../src/index";

const sleep = (ms: number = 1000) => new Promise((r) => setTimeout(r, ms));

describe("Signature Debouncer", () => {
  it("invokes function only after timeout", async () => {
    const exampleArray: string[] = [];
    const exampleFunc = () => exampleArray.push("Test!");

    debouncer.run(exampleFunc);
    expect(exampleArray).toHaveLength(0);
    await sleep();

    expect(exampleArray).toHaveLength(1);
  });

  it("clears previous invocations", async () => {
    const exampleArray: string[] = [];
    const exampleFunc = () => exampleArray.push("Test!");

    debouncer.run(exampleFunc);
    expect(exampleArray).toHaveLength(0);

    await sleep();
    expect(exampleArray).toHaveLength(1);

    debouncer.run(exampleFunc);
    await sleep();
    expect(exampleArray).toHaveLength(2);
  });

  it("prevents multiple invocations within timeout", async () => {
    const exampleArray: string[] = [];
    const exampleFunc = () => exampleArray.push("Test!");

    debouncer.run(exampleFunc);
    debouncer.run(exampleFunc);
    debouncer.run(exampleFunc);
    expect(exampleArray).toHaveLength(0);

    await sleep();
    expect(exampleArray).toHaveLength(1);
  });

  it("treats different signatures as seperate invocations", async () => {
    const exampleArray: string[] = [];
    const exampleFunc = () => exampleArray.push("Test!");

    debouncer.run(exampleFunc);
    debouncer.run(exampleFunc, { key: "value" });
    expect(exampleArray).toHaveLength(0);

    await sleep();
    expect(exampleArray).toHaveLength(2);
  });

  it("works independently of the function applied", async () => {
    const exampleArray: string[] = [];
    const exampleFunc = () => exampleArray.push("Test!");
    const anotherFunc = () => exampleArray.push("Test Again???");

    debouncer.run(exampleFunc, { same: "signature" });
    debouncer.run(anotherFunc, { same: "signature" });
    expect(exampleArray).toHaveLength(0);

    await sleep();
    expect(exampleArray).toHaveLength(1);
  });
});
