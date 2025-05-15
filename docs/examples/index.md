# Basic Examples

This page demonstrates basic usage of FuncyStr with interactive examples.

## Basic String Processing

Instantiating the library with base functions, you can use those to process functions within the text. All functions given to FuncyStr must include `params` as the first parameter, even if they don't use it.

::: warning
As of funcystr v2.0, the result of the `process` operation is now a Promise that resolves into the processed string. This allows the use of advanced async functions.
:::

```js
  const funcyStr = new FuncyStr({
    uppercase: (params, str) => str.toUpperCase(),
    repeat: (params, str, times) => str.repeat(Number(times)),
  });
```

We can process strings directly, without needing external parameters.

```js
  result = await funcyStr.process(
    "{{uppercase|this}} is a demo that is {{repeat|really |3}} simple."
  )
```
```txt
> THIS is a demo that is really really really simple.
```