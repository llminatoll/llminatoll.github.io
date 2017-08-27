# css-node-extract
[![Build Status](https://travis-ci.org/maoberlehner/css-node-extract.svg?branch=master)](https://travis-ci.org/maoberlehner/css-node-extract)

Extract certain nodes from CSS code.

## Filters
- **at-rules**: `@media`, `@supports`, `@mixin`,...
- **declarations**: `$variable`
- **functions**: `@function`
- **mixins**: `@mixin` and `.less-mixin-selector()`
- **rules**: `.class-selector`, `#id-selector`,...
- **silent**: Extract only nodes that do not compile to CSS code (mixins, placeholder selectors, variables,...)
- **variables**: `$sass-variable` and `@less-variable`
- **custom**: Define a custom filter

## Demos
```js
var CssNodeExtract = require('css-node-extract');
var postcssScssSyntax = require('postcss-scss');

var options = {
  // CSS source code as string.
  css: '$variable: "value"; .selector { } .other-selector { }',
  // Extract only variables.
  filterNames: ['variables'],
  // postcss syntax plugin to add support for SCSS code.
  postcssSyntax: postcssScssSyntax
};

// Asynchronous:
CssNodeExtract.process(options).then((extractedCss) => {
  console.log(extractedCss); // Outputs: '$variable: "value";'.
});

// Synchronous:
var extractedCss = CssNodeExtract.processSync(options);
console.log(extractedCss); // Outputs: '$variable: "value";'.
```

### Custom filter
```js
var CssNodeExtract = require('css-node-extract');

var options = {
  // CSS source code as string.
  css: '@keyframes { } .selector { } .other-selector { }',
  filterNames: ['custom'],
  customFilter: [
    [
      { property: 'type', value: 'atrule' },
      { property: 'name', value: 'keyframes' },
    ],
  ]
};

CssNodeExtract.process(options).then((extractedCss) => {
  console.log(extractedCss); // Outputs: '@keyframes { }'.
});
```

## Development
See [CONTRIBUTING.md](https://github.com/maoberlehner/css-node-extract/blob/master/CONTRIBUTING.md)

### Testing
```bash
npm test
```

## About
### Author
Markus Oberlehner  
Twitter: https://twitter.com/MaOberlehner  
PayPal.me: https://paypal.me/maoberlehner

### License
MIT
