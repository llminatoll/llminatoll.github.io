import postcss from 'postcss';
import postcssNodeExtract from './lib/postcss-node-extract';

/**
 * Default options.
 *
 * @type {Object}
 */
const defaultOptions = {
  css: ``,
  filterNames: [],
  customFilter: undefined,
  postcssSyntax: undefined,
};

/**
 * CssNodeExtract
 */
export default class CssNodeExtract {
  /**
   * Asynchronously extract nodes from a string.
   *
   * @param {Object} options
   *   Configuration options.
   * @return {Promise}
   *   Promise for a string with the extracted nodes.
   */
  static process(options = {}) {
    return new Promise((resolve) => {
      const result = CssNodeExtract.processSync(options);
      resolve(result);
    });
  }

  /**
   * Synchronously extract nodes from a string.
   *
   * @param {Object} options
   *   Configuration options.
   * @return {String}
   *   Extracted nodes.
   */
  static processSync(options = {}) {
    const data = Object.assign({}, defaultOptions, options);
    return postcss(postcssNodeExtract(data.filterNames, data.customFilter))
      .process(data.css, { syntax: data.postcssSyntax }).css;
  }
}
