'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var postcss = _interopDefault(require('postcss'));

/**
 * Check if a selector should be whitelisted and / or replaced.
 * @param {string} ruleSelector - The selector to check for whitelisting / replacement.
 * @param {Array} ruleParentSelectors - Array of parent selectors, child selectors get whitelisted.
 * @param {Array} selectorFilters - Array of selector filter objects or selectors.
 * @return {string} Empty string or whitelisted / replaced rule selector.
 */
function filterSelector(ruleSelector, ruleParentSelectors, selectorFilters) {
  var newSelector = "";

  selectorFilters.some(function (selectorFilter) {
    var selector = selectorFilter.selector || selectorFilter;
    var replacementSelector = selectorFilter.replacement;
    var parentComparisonSelector = replacementSelector || selector;

    var selectorsAreEqual = selector === ruleSelector;
    // eslint-disable-next-line arrow-body-style
    var parentSelectorIsEqual = ruleParentSelectors.reduce(function (bool, ruleParentSelector) {
      return parentComparisonSelector instanceof RegExp ? parentComparisonSelector.test(ruleParentSelector) : ruleParentSelector === parentComparisonSelector;
    }, false);
    var selectorsMatch = selector instanceof RegExp && selector.test(ruleSelector);

    if (selectorsAreEqual || parentSelectorIsEqual || selectorsMatch) {
      newSelector = replacementSelector ? ruleSelector.replace(selector, replacementSelector) : ruleSelector;

      // Do not stop iterating over the selector filters if the parent selector was matched
      // because child selectors may get replaced in a further iteration.
      if (!parentSelectorIsEqual) return true;
    }
    return false;
  });

  return newSelector;
}

/**
 * Provide a PostCSS plugin for extracting and replacing CSS selectors.
 * @param {Array} selectorFilters - Array of selector filter objects or selectors.
 * @return {Function} PostCSS plugin.
 */
function postcssSelectorExtract() {
  var selectorFilters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  return postcss.plugin('postcss-extract-selectors', function () {
    return function (nodes) {
      nodes.walkRules(function (rule) {
        var ruleSelectors = rule.selector.split(',').map(function (ruleSelector) {
          return ruleSelector.replace(/(\r\n|\n|\r)/gm, '').trim();
        }).map(function (ruleSelector) {
          return filterSelector(ruleSelector, rule.parent.selector ? rule.parent.selector.split(',') : [], selectorFilters);
        }).filter(function (ruleSelector) {
          return ruleSelector.length;
        });

        if (ruleSelectors.length) {
          // eslint-disable-next-line no-param-reassign
          rule.selector = ruleSelectors.join(',');
        } else {
          rule.remove();
        }
      });

      // Remove empty @ rules.
      nodes.walkAtRules(function (rule) {
        if (rule.nodes && !rule.nodes.length) rule.remove();
      });
    };
  });
}

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * CssSelectorExtract
 */

var CssSelectorExtract = function () {
  function CssSelectorExtract() {
    _classCallCheck(this, CssSelectorExtract);
  }

  _createClass(CssSelectorExtract, null, [{
    key: 'process',

    /**
     * Asynchronously extract and replace CSS selectors from a string.
     * @param {string} css - CSS code.
     * @param {Array} selectorFilters - Array of selector filter objects or selectors.
     * @param {Object} postcssSyntax - PostCSS syntax plugin.
     * @return {Promise} Promise for a string with the extracted selectors.
     */
    value: function process(css, selectorFilters) {
      var postcssSyntax = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

      return new Promise(function (resolve) {
        var result = CssSelectorExtract.processSync(css, selectorFilters, postcssSyntax);
        resolve(result);
      });
    }

    /**
     * Synchronously extract and replace CSS selectors from a string.
     * @param {string} css - CSS code.
     * @param {Array} selectorFilters - Array of selector filter objects or selectors.
     * @param {Object} postcssSyntax - PostCSS syntax plugin.
     * @return {string} Extracted selectors.
     */

  }, {
    key: 'processSync',
    value: function processSync(css, selectorFilters) {
      var postcssSyntax = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

      return postcss(postcssSelectorExtract(selectorFilters)).process(css, { syntax: postcssSyntax }).css;
    }
  }]);

  return CssSelectorExtract;
}();

module.exports = CssSelectorExtract;
