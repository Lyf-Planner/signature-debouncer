# signature-debouncer

> A global singleton which debounces function invocations on the basis of a custom data signature</p>

<p>
  <a href="https://www.npmjs.com/package/signature-debouncer"><img src="https://img.shields.io/npm/v/signature-debouncer/latest.svg?style=flat-square" alt="NPM version" /> </a>
  <a href="https://www.npmjs.com/package/signature-debouncer"><img src="https://img.shields.io/npm/dm/signature-debouncer.svg?style=flat-square" alt="NPM downloads"/> </a>
  <a href="https://github.com/ethanhusband/signature-debouncer/blob/main/LICENSE.md"><img src="https://img.shields.io/npm/l/signature-debouncer.svg?style=flat-square" alt="GitHub license"/> </a>
</p>

## Installation

```npm install signature-debouncer```

or

```yarn add signature-debouncer```

## API

`run(func: () => any, signature: Object = {}, duration: number = 1000)`

Will run `func` after `duration`, unless any calls to `run` with the same `signature` are also made inside this time.

If the duration has not timed out, and another call with the same `signature` is made, the function timer will reset (debounce) and will now be called after the new `duration` parameter.

Note: `signature` equality is tested via JSON stringification

## Usage

The `SignatureDebouncer` can be used anywhere in your project to globally debounce a function based on some arbitrary signature. The signature can be any object, but good examples include the function's parameters, the function name - anything you possibly may want to use to differentiate what function calls are to be debounced independently:

Consider the following setup:

```
import SignatureDebouncer from 'signature-debouncer';

const someData = [1, 2, 3, 4];
function exampleFunction = (data) => someData.push(data);
```

If I want a function to only debounce based on it's argument and name, I could do the following

```
const arg = 5;
SignatureDebouncer.run(() => exampleFunction(arg), { funcName: exampleFunction.name, arg });

// After 1000ms (default)

console.log(someData);

// [1, 2, 3, 4, 5]
```

Now suppose you have some data with ID `1234` being updated from multiple sources in quick succession, but only want to apply the final result after the flurry of updates is over. You could use the signature `{ id: '1234' }` and apply a delay of `5000` ms:
```
const updateItemTitle = (title) => console.log("Updated title!");
const updateItemDate = (date) => console.log("Updated date!");

// These calls can come from anywhere in the project...
SignatureDebouncer.run(() => updateItemTitle(someTitle), { id: '1234' }, 5000); // User A updates at 30ms
SignatureDebouncer.run(() => updateItemDate(someDate), { id: '1234' }, 5000); // User B updates at 500ms
SignatureDebouncer.run(() => updateItemTitle(anotherTitle), { id: '1234' }, 5000); // User A updates at 2000ms
SignatureDebouncer.run(() => updateItemDate(anotherDate), { id: '1234' }, 5000); // User B updates at 5000ms

// After 5000ms uninterrupted seconds, the console would show "Updated date!"
```

The `SignatureDebouncer` debounces any function call it wraps, globally, purely based on the signature. For the sake of argument, if you excluded the signature and wrapped every single function in this debouncer, you would globally delay every single function call by 1000ms (probably don't do this lol).

The point is to extract messy debouncer management when you do want the debouncing condition to be a bit more arbitrary or independent of the place or time a function is called.

For further usage examples, perhaps visit the `tests` directory.

## Built With

- [TypeScript](https://www.typescriptlang.org/) - JavaScript that scales
- [Jest](https://jestjs.io/) - Delightful JavaScript Testing

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
