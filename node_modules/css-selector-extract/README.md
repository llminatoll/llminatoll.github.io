# css-selector-extract
[![Build Status](https://travis-ci.org/maoberlehner/css-selector-extract.svg?branch=master)](https://travis-ci.org/maoberlehner/css-selector-extract)

With selector extracting, it is possible to extract certain CSS selectors (RegEx can be used to match selectors) from CSS code. This is especially useful if you want to extract only a few CSS classes from a huge library or framework.

## Demos
```js
var CssSelectorExtract = require('css-selector-extract');

// CSS source code as string.
var css = '.btn { } .btn-alert { } .btn-success { }';
// Array of selectors which should get extracted.
var selectorFilters = ['.btn'];

// Asynchronous:
CssSelectorExtract.process(css, selectorFilters).then((extractedCss) => {
  console.log(extractedCss); // Outputs: `.btn { }`.
});

// Synchronous:
var extractedCss = CssSelectorExtract.processSync(css, selectorFilters);
console.log(extractedCss); // Outputs: `.btn { }`.
```

### Rename extracted selectors
```js
var CssSelectorExtract = require('css-selector-extract');

// CSS source code as string.
var css = '.btn { } .btn-alert { } .btn-success { }';
// Array of selector filter objects with selectors
// which should get extracted and replaced.
var selectorFilters = [{ selector: '.btn', replacement: '.button' }];

// Asynchronous:
CssSelectorExtract.process(css, selectorFilters).then((extractedCss) => {
  console.log(extractedCss); // Outputs: `.button { }`.
});
```

### RegEx
#### Filter selectors
```js
var CssSelectorExtract = require('css-selector-extract');

var css = '.btn { } .btn-alert { }';
var selectorFilters = [/^\..+-alert/];

CssSelectorExtract.process(css, selectorFilters).then((extractedCss) => {
  console.log(extractedCss); // Outputs: `.btn-alert { }`.
});
```

#### Replace selectors
```js
var CssSelectorExtract = require('css-selector-extract');

var css = '.btn { } .btn-alert { }';
var selectorFilters = [{ selector: /^\.btn(.*)/, replacement: '.button$1' }];

CssSelectorExtract.process(css, selectorFilters).then((extractedCss) => {
  console.log(extractedCss); // Outputs: `.button { } .button-alert { }`.
});
```

### Usage with syntaxes other than pure CSS
Install the corresponding postcss syntax plugin (e.g. [postcss-scss](https://www.npmjs.com/package/postcss-scss) or [postcss-less](https://www.npmjs.com/package/postcss-less)).

```js
var CssSelectorExtract = require('css-selector-extract');
var postcssScss = require('postcss-scss');

var css = '.nested { .selector { } }';
var selectorFilters = ['.nested'];

// Add the postcss syntax plugin as third parameter.
CssSelectorExtract.process(css, selectorFilters, postcssScss).then((extractedCss) => {
  console.log(extractedCss);
});
```

## Development
See [CONTRIBUTING.md](https://github.com/maoberlehner/css-selector-extract/blob/master/CONTRIBUTING.md)

### Testing
```bash
npm test
```

## About
### Author
Markus Oberlehner  
Website: https://markus.oberlehner.net  
Twitter: https://twitter.com/MaOberlehner  
PayPal.me: https://paypal.me/maoberlehner

### License
MIT
