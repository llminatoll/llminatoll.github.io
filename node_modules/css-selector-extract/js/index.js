import postcss from 'postcss';

import postcssSelectorExtract from './lib/postcss-selector-extract';

/**
 * CssSelectorExtract
 */
export default class CssSelectorExtract {
  /**
   * Asynchronously extract and replace CSS selectors from a string.
   * @param {string} css - CSS code.
   * @param {Array} selectorFilters - Array of selector filter objects or selectors.
   * @param {Object} postcssSyntax - PostCSS syntax plugin.
   * @return {Promise} Promise for a string with the extracted selectors.
   */
  static process(css, selectorFilters, postcssSyntax = undefined) {
    return new Promise((resolve) => {
      const result = CssSelectorExtract.processSync(
        css,
        selectorFilters,
        postcssSyntax,
      );
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
  static processSync(css, selectorFilters, postcssSyntax = undefined) {
    return postcss(postcssSelectorExtract(selectorFilters))
      .process(css, { syntax: postcssSyntax }).css;
  }
}
