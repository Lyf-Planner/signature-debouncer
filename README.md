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

`debouncer.run(func: () => void, signature: Object, duration: number, options: DebounceOptions = {})`

Will run `func` after `duration` ms, unless any calls to `run` with the same `signature` are also made inside this time.

If the duration has not timed out, and another call with the same `signature` is made, the function timer will reset (debounce) and will now be called after the new `duration` parameter.

Optional params can be included in the options object. Currently this includes:
- `fireNow: boolean`
  - Setting this to true will ignore the duration and invoke the function on that signature immediately.

`debouncer.cancel(signature: Object)`

This will cancel any pending function invocation on the provided signature.

**Note**: `signature` equality is tested via JSON stringification,

## Usage

The `SignatureDebouncer` (imported as `debouncer`) can be used anywhere in your project to globally debounce a function based on some arbitrary signature. 

**Basic Usage:**

```ts
import debouncer from 'signature-debouncer';

const data = [1, 2, 3, 4];
const func = (value: number) => data.push(value);

// this signature is entirely arbitrary
const signature = "push to data array";

// debounce the function, providing the signature 
debouncer.run(() => func(5), signature, 1000);

// after say 500ms, if we call again with the same signature, it debounces the first call;
debouncer.run(() => func(8), signature, 1000);

// after 1000ms, as long as we don't call again on the same signature, the invocation will finally run

console.log(data);

// [1, 2, 3, 4, 8]

```

The takeaway is that the debounce is entirely based on the provided signature, regardless of the function supplied.

Reading the `/tests` directory may be helpful to observe more use cases and behaviour. 

**Using the Signature:**

The `signature` can be any object you wish to debounce on the basis of. Common examples include the function's parameters, the function name - anything you possibly may want to use to differentiate what function calls are to be debounced independently.

For example, if I wanted a function to only debounce based on a custom signature, that signature could be an object containing it's `name` and `arg`. 

I could first do the following to run it as a regular old timeout function:

```ts
const data = [1,2,3,4];
const func = (value: number) => data.push(value);

const arg = 5;
const signature = { funcName: func.name, arg };

debouncer.run(() => func(arg), signature);

// After 1000ms

console.log(someData);

// [1,2,3,4,5]
```

However if I did `debounce.run` on a different function with the same signature for whatever reason, before the other had timed out, the original function would be debounced and replaced with the new one!

```ts
const data = [1,2,3,4];
const func = (value: number) => data.push(value);

const arg = 5;
const anotherArg = 6;
const signature = { funcName: func.name, arg };

debouncer.run(() => func(arg), signature);
debouncer.run(() => func(anotherArg), signature);

// After 1000ms
// The original function call is debounced by the more recent one:

console.log(data);

// [1, 2, 3, 4, 6]
```

Alternatively, running the same function with a different `signature`, will have them running in parallel, since the debouncer will only debounce for the same signature!

```ts
const data = [1,2,3,4];
const func = (value: number) => data.push(value);

const arg = 5;
const signature = { funcName: func.name, arg }

const anotherArg = 6;
const anotherSignature = { funcName: func.name, anotherArg };

debouncer.run(() => exampleFunction(arg), signature);
debouncer.run(() => exampleFunction(anotherArg), anotherSignature);

// After 1000ms

console.log(someData);

// [1, 2, 3, 4, 5, 6]
```

## More Practical Examples

For a more realistic use case, suppose you have some data with ID `1234` being updated from multiple sources in quick succession, but only want to apply the final result after the flurry of updates is over. You could simply use the id of the data `1234` as the signature and apply a delay of `5000` ms:
```ts
const item = {
  id: "1234",
  title: "hello world",
  date: "2024-04-24"
};

const updateTitle = (title) => {
  item.title = title;
}
const updateCats = (name) => {
  item.name = date;
}

// These calls could come from anywhere in the project...
debouncer.run(() => updateDate("2024-04-25"), item.id, 5000);
debouncer.run(() => updateTitle('test'), item.id, 5000);
debouncer.run(() => updateDate("2024-04-25"), item.id, 5000);
debouncer.run(() => updateTitle('testing'), item.id, 5000);

// After 5000ms uninterrupted seconds, item would finally get updated:

console.log(item);

// Only the title gets updated, because the title
// update was the last invocation under that signature :)
//
// {
//   id: "1234",
//   title: "testing",
//   date: "2024-04-23"
// }

```

The `debouncer` debounces any function call it wraps, globally, purely based on the signature. 

The point is to extract messy debouncer management when you do want the debouncing condition to be a bit more arbitrary or independent of the place or time a function is called. This is especially useful in large applications where you only want to update data from one place at a time.

## Best Practices

A recommendation when applying this package is to store all the signatures used across the app in one file, such that no accidental reuse of a signature occurs where it shouldn't.

It is advised to have a `signatures.ts` file somewhere containing an indexing object where all your signature definitions live, for example:

```ts
// signatures.ts

const signatureUseCaseOne: "describe the use case for readers/reviewers";
const signatureUseCaseTwo: "describe this use case too";

```

Note that if your use case intends to be based on some parameters, it could be a good idea to also store a function in this index:

```ts
// signatures.ts

const signatureUseCaseOne: "describe the use case for readers/reviewers";
const signatureUseCaseTwo: "describe this use case too";

const signatureUseCaseWithArgs: (args) => ({
  use_case: "description",
  params: { ...args }
});
```

This practice not only prevents the accidental reuse of signatures, but also enables a basic control click lookup of where signatures are being used to evaluate and debug your debouncers across the app.



This is of course a best practice and highly recommended, but not strictly necessary.

## Built With

- [TypeScript](https://www.typescriptlang.org/) - JavaScript that scales
- [Jest](https://jestjs.io/) - Delightful JavaScript Testing

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
