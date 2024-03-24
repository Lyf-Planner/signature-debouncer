# signature-debouncer

> Debounces function invocations globally on the basis of a custom data signature

<p>
  <a href="https://www.npmjs.com/package/signature-debouncer"><img src="https://img.shields.io/npm/v/signature-debouncer/latest.svg?style=flat-square" alt="NPM version" /> </a>
  <a href="https://www.npmjs.com/package/signature-debouncer"><img src="https://img.shields.io/npm/dm/signature-debouncer.svg?style=flat-square" alt="NPM downloads"/> </a>
  <a href="https://github.com/ethanhusband/signature-debouncer/blob/main/LICENSE.md"><img src="https://img.shields.io/npm/l/signature-debouncer.svg?style=flat-square" alt="GitHub license"/> </a>
</p>

## Installation

```npm install signature-debouncer```

*or*

```yarn add signature-debouncer```

## API

`debouncer.run(func: () => any, signature: any = {}, duration: number = 1000)`

Will run `func` after `duration`, unless any calls to `run` with the same `signature` are also made inside this time.

If the duration has not timed out, and another call with the same `signature` is made, the function timer will reset (debounce) and will now be called after the new `duration` parameter.

Note: `signature` equality is tested via JSON stringification,

## Usage

The `SignatureDebouncer` (imported as `debouncer`) can be used anywhere in your project to globally debounce a function based on some arbitrary signature. 

**Basic Usage:**

```
import debouncer from 'signature-debouncer';

const someData = [1, 2, 3, 4];
function examplePushFunction = () => someData.push(data);

debouncer.run(() => examplePushFunction(5));

// After 1000ms

console.log(someData)

// [1, 2, 3, 4, 5]

```

**Using the Signature:**

The `signature` can be any object you wish to debounce on the basis of. Good examples include the function's parameters, the function name - anything you possibly may want to use to differentiate what function calls are to be debounced independently.

If I wanted a function to only debounce based on a custom signature, for example, that signature could be an object containing it's `name` and `arg`, I could first do the following to run it as a regular old timeout function:

```
someData = [1,2,3,4];

const arg = 5;
const signature = { funcName: exampleFunction.name, arg };

debouncer.run(() => exampleFunction(arg), signature);

// After 1000ms

console.log(someData);

// [1,2,3,4,5]
```

However if I did `debounce.run` on a different function with the same signature, before the other had timed out, the original function would be debounced and replaced with the new one!

```
someData = [1,2,3,4];

const arg = 5;
const anotherArg = 6;
const signature = { funcName: exampleFunction.name, arg };

debouncer.run(() => exampleFunction(arg), signature);
debouncer.run(() => exampleFunction(anotherArg), signature);

// After 1000ms
// The original function call is debounced by the more recent one:

console.log(someData);

// [1, 2, 3, 4, 6]
```

Alternatively, running the same function with a different `signature`, will have them running in parallel, since the debouncer will only debounce for the same signature!

```
someData = [1,2,3,4];

const arg = 5;
const signature = { funcName: exampleFunction.name, arg }

const anotherArg = 6;
const anotherSignature = { funcName: exampleFunction.name, anotherArg };

debouncer.run(() => exampleFunction(arg), signature);
debouncer.run(() => exampleFunction(anotherArg), anotherSignature);

// After 1000ms

console.log(someData);

// [1, 2, 3, 4, 5, 6]
```

## Examples

For a more realistic use case, suppose you have some data with ID `1234` being updated from multiple sources in quick succession, but only want to apply the final result after the flurry of updates is over. You could simply use the signature `1234` and apply a delay of `5000` ms:
```
const updateItemTitle = (title) => {
    // .. updating logic
    console.log("Updated title!");
}
const updateItemDate = (date) => {
    // .. updating logic
    console.log("Updated date!");
}

// These calls could come from anywhere in the project...
debouncer.run(() => updateItemTitle(someTitle), { id: '1234' }, 5000);
debouncer.run(() => updateItemDate(someDate), { id: '1234' }, 5000);
debouncer.run(() => updateItemTitle(anotherTitle), { id: '1234' }, 5000);
debouncer.run(() => updateItemDate(anotherDate), { id: '1234' }, 5000);

// After 5000ms uninterrupted seconds, the console would show "Updated date!"
// This is because the date update was the last invocation under that signature :)
```

The `debouncer` debounces any function call it wraps, globally, purely based on the signature. 

The point is to extract messy debouncer management when you do want the debouncing condition to be a bit more arbitrary or independent of the place or time a function is called.

For further usage examples, visit the `tests` directory.

## Best Practices

The above examples are more so provided for the sake of conveying what this structure does, and are not a good demonstration of what you should do in a production-ready codebase.

The recommended way to apply this package is to store all the signatures used across the app in an indexing object, such that no accidental reuse of a signature occurs where it shouldn't. 

It is advised to have a `signatures.ts` file somewhere containing an indexing object where all your signature definitions live, for example:

```
// signatures.ts

export const DebounceSignatureIndex = {
  UseCaseOne: "describe the use case for readers/reviewers",
  UseCaseTwo: "describe this use case too",
  ...
} as const;
```

Note that if your use case intends to be based on some parameters, it's entirely valid to also store a function in this index:

```
// signatures.ts

export const DebounceSignatureIndex = {
  UseCaseOne: "describe the use case for readers/reviewers",
  UseCaseTwo: "describe this use case too",
  UseCaseWithArgs: (args) => ({
    use_case: "description",
    params: {...args}
  })
} as const;
```

This practice not only prevents the accidental reuse of signatures, but also enables a basic control click lookup of where signatures are being used to evaluate and debug your debouncers across the app.

Then the debouncer can be run succinctly and safely as such:

```
debouncer.run(myFunc, DebounceSignatureIndex.someDescriptiveSignature);
```

Strong typing of your indexing constant is advised

This is of course a best practice and highly recommended, but not strictly necessary.

## Built With

- [TypeScript](https://www.typescriptlang.org/) - JavaScript that scales
- [Jest](https://jestjs.io/) - Delightful JavaScript Testing

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
