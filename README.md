# FuncyStr Library
![Node.js CI](https://github.com/mooeypoo/FuncyStr/actions/workflows/test.yaml/badge.svg) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://buymeacoffee.com/mooeypoo)

FuncyStr is a lightweight JavaScript library designed to process strings with embedded functions. It allows dynamic string resolution based on provided parameters, supporting nested and multiple function calls within a single string.

## Features

- **Dynamic String Resolution**: Replace placeholders in strings with dynamic values based on provided parameters.
- **Custom Functions**: Define your own functions to handle specific placeholders.
- **Nested Functions**: Supports resolving functions within other functions.
- **Graceful Handling**: Leaves unresolved placeholders intact if no matching function is defined.

## Installation

Install FuncyStr via npm:

```bash
npm install funcystr --save-dev
```

## Usage

### Basic Example

```javascript
import FuncyStr from 'funcystr';

const fstr = new FuncyStr({
    PRONOUN: (params, he, she, they) => params.pronoun === 'he' ? he : params.pronoun === 'she' ? she : they;
    PLURAL: (params, one, plural) => (params.plural ? plural : one),
});

const result = fstr.process("{{He is|She is|They are}} very welcome to join us.", { pronoun: 'he' });
console.log(result); // Output: "He is very welcome to join us."
```

### Nested Functions

```javascript
const input = "{{PLURAL|This is|These are}} lovely {{PRONOUN|{{PLURAL|man|men}}|{{PLURAL|woman|women}}|{{PLURAL|person|people}}}}.";
const result = fstr.process(input, { pronoun: 'they', plural: true });
console.log(result); // Output: "These are lovely people."
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

This project is licensed under the MIT License by Moriel Schottlender. Credit is appreciated.

If you want to support this project, please feel free to submit pull requests, add issues, or support me by [buying me coffee](https://buymeacoffee.com/mooeypoo).
