# Getting started

## Installation

Install FuncyStr via npm:

```bash
npm install funcystr --save-dev
```

## API

### `new FuncyStr(functions)`

Creates a new FuncyStr instance.

- `functions`: An object where keys are function names and values are the corresponding resolver functions.

### `process(input, params)`

Processes a string and resolves all placeholders.

- `input`: The string containing placeholders to resolve.
- `params`: An object containing parameters used by the resolver functions.

## Usage

### Basic example

```javascript
import FuncyStr from 'funcystr';

const fstr = new FuncyStr({
    PRONOUN: (params, he, she, they) => params.pronoun === 'he' ? he : params.pronoun === 'she' ? she : they,
    PLURAL: (params, one, plural) => (params.plural ? plural : one),
});

const result = await fstr.process("{{He is|She is|They are}} very welcome to join us.", { pronoun: 'he' });
console.log(result); // Output: "He is very welcome to join us."
```

### Nested functions

```javascript
const input = "{{PLURAL|This is|These are}} lovely {{PRONOUN|{{PLURAL|man|men}}|{{PLURAL|woman|women}}|{{PLURAL|person|people}}}}.";

const result = await fstr.process(input, { pronoun: 'they', plural: true });
console.log(result); // Output: "These are lovely people."
```

### Handling missing functions

```javascript
const result = await fstr.process("This is a {{UNKNOWN|arg1|arg2}}.", {});
console.log(result); // Output: "This is a {{UNKNOWN|arg1|arg2}}."
```
## Testing

Run the test suite to ensure everything is working as expected:

```bash
npm run test
```
