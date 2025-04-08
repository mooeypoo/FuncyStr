# FuncyStr Library

FuncyStr is a lightweight JavaScript library designed to process strings with embedded functions. It allows dynamic string resolution based on provided parameters, supporting nested and multiple function calls within a single string.

## Features

- **Dynamic String Resolution**: Replace placeholders in strings with dynamic values based on provided parameters.
- **Custom Functions**: Define your own functions to handle specific placeholders.
- **Nested Functions**: Supports resolving functions within other functions.
- **Graceful Handling**: Leaves unresolved placeholders intact if no matching function is defined.

## Installation

Install FuncyStr via npm:

```bash
npm install funcystr
```

## Usage

### Basic Example

```javascript
import FuncyStr from 'funcystr';

const fstr = new FuncyStr({
    GENDER: (params, m, f) => (params.m ? m : f),
    PLURAL: (params, one, plural) => (params.plural ? plural : one),
});

const result = fstr.process("This is a {{GENDER|man|woman}}.", { m: true });
console.log(result); // Output: "This is a man."
```

### Nested Functions

```javascript
const input = "This is a {{GENDER|{{PLURAL|man|men}}|{{PLURAL|woman|women}}}}.";
const result = fstr.process(input, { m: true, plural: true });
console.log(result); // Output: "This is a men."
```

### Handling Missing Functions

```javascript
const result = fstr.process("This is a {{UNKNOWN|arg1|arg2}}.", {});
console.log(result); // Output: "This is a {{UNKNOWN|arg1|arg2}}."
```

## API

### `new FuncyStr(functions)`

Creates a new FuncyStr instance.

- `functions`: An object where keys are function names and values are the corresponding resolver functions.

### `process(input, params)`

Processes a string and resolves all placeholders.

- `input`: The string containing placeholders to resolve.
- `params`: An object containing parameters used by the resolver functions.

## Testing

Run the test suite to ensure everything is working as expected:

```bash
npm run test
```

## License

This project is licensed under the MIT License.