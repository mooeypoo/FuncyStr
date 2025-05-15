# Basic Examples

This page demonstrates basic usage of FuncyStr with interactive examples.

## Providing parameters 

Parameters can be given by the general application to set the values within given functions by the context. This can be used to dynamically change the processed values depending on some external choices given to users or within the application.

One example for this is allowing the user to choose variables that will change the string processing, like in the example below. You can see how changing the values in the inputs changes the result:

```js
const funcyStr = new FuncyStr({
  // {{charname}} --> params.name
  charname: (params) => params.name,
  pronoun: (params, he, she, they) => {
    return params.pronoun === 'he' ?
      he : params.pronoun === 'she' ?
      she : they;
  }
});
```

The result of processing strings given the above functions depend on the values of the parameters:

```js
  funcyStr.process(
    '{{charname}} went to the store and bought \
    {{pronoun|himself|herself|themselves}} the groceries \
    {{pronoun|he|she|they}} wanted most.',
    {
      name: `Sam`,
      pronoun: `they`
    }
  )
```

```txt
> Sam went to the store and bought themselves the groceries 
  they wanted most.
```

If we run this with different parameters, the output will change accordingly:

```js
  funcyStr.process(
    '{{charname}} went to the store and bought \
    {{pronoun|himself|herself|themselves}} the groceries \
    {{pronoun|he|she|they}} wanted most.',
    {
      name: `Max`,
      pronoun: `she`
    }
  )
```

```txt
> Max went to the store and bought herself the groceries 
  she wanted most.
```

