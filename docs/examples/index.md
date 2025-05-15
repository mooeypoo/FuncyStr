# Basic Examples

This page demonstrates basic usage of FuncyStr with interactive examples.

## Basic String Processing

Instantiating the library with base functions, you can use those to process functions within the text. All functions given to FuncyStr must include `params` as the first parameter, even if they don't use it.

```js
  const funcyStr = new FuncyStr({
    uppercase: (params, str) => str.toUpperCase(),
    repeat: (params, str, times) => str.repeat(Number(times)),
  });
```

We can process strings directly, without needing external parameters.

```js
  funcyStr.process(
    "{{uppercase|this}} is a demo that is {{repeat|really |3}} simple."
  )
```
```txt
> THIS is a demo that is really really really simple.
```