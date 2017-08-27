'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var postcss = _interopDefault(require('postcss'));

/**
 * Check if a node matches the given filter.
 *
 * @param {Object} node
 *   A postcss node object.
 * @param {Object} filter
 *   Filter object.
 * @return {Boolean}
 *   Returns true if the node matches the filter and false if not.
 */
function nodeMatchesFilter(node, filter) {
  if (!node[filter.property]) { return false; }
  if (node[filter.property] === filter.value) { return true; }
  if (filter.value instanceof RegExp && filter.value.test(node[filter.property])) { return true; }
  return false;
}

/**
 * Whiteliste a node if it (or one of the nodes parents) matches the given filter.
 *
 * @param {Object} node
 *   A postcss node object.
 * @param {Array} filterGroups
 *   Array of filter groups.
 * @return {Boolean}
 *   Returns true if the node (or one of its parents) matches one or more
 *   filter groups and false if not.
 */
function extractNodeRecursively(node, filterGroups) {
  if (node.parent && node.parent.type !== "root") { return extractNodeRecursively(node.parent, filterGroups); }

  var extractNode = false;

  filterGroups.some(function (groupOrFilter) {
    var filterGroup = Array.isArray(groupOrFilter) ? groupOrFilter : [groupOrFilter];
    extractNode = filterGroup.filter(
      function (filter) { return !nodeMatchesFilter(node, filter); }
    ).length === 0;
    return extractNode;
  });

  return extractNode;
}

/**
 * Filter definitions.
 *
 * @type {Object}
 */
var filterDefinitions = {
  'at-rules': [
    { property: "type", value: "atrule" } ],
  declarations: [
    { property: "type", value: "decl" } ],
  functions: [
    [
      { property: "type", value: "atrule" },
      { property: "name", value: "function" } ] ],
  mixins: [
    [
      { property: "type", value: "atrule" },
      { property: "name", value: "mixin" } ],
    [
      { property: "type", value: "rule" },
      { property: "selector", value: /\(.*\)/ } ] ],
  rules: [
    { property: "type", value: "rule" } ],
  silent: [
    [
      { property: "type", value: "atrule" },
      { property: "name", value: "debug" } ],
    [
      { property: "type", value: "atrule" },
      { property: "name", value: "error" } ],
    [
      { property: "type", value: "atrule" },
      { property: "name", value: "function" } ],
    [
      { property: "type", value: "atrule" },
      { property: "name", value: "mixin" } ],
    [
      { property: "type", value: "atrule" },
      { property: "name", value: "warn" } ],
    [
      { property: "type", value: "decl" },
      { property: "prop", value: /^[$|@]/ } ],
    [
      { property: "type", value: "rule" },
      { property: "selector", value: /%/ } ],
    [
      { property: "type", value: "rule" },
      { property: "selector", value: /\(.*\)/ } ] ],
  variables: [
    [
      { property: "type", value: "decl" },
      { property: "prop", value: /^[$|@]/ } ] ],
};

/**
 * A PostCSS plugin for extracting nodes from CSS code.
 *
 * @param {Array|String} filterNames
 *   Multiple filter names as array or a single filter name as string.
 * @param {Object} customFilter
 *   Custom filter object.
 * @return {Function}
 *   PostCSS plugin.
 */
function postcssNodeExtract(filterNames, customFilter) {
  if ( filterNames === void 0 ) filterNames = [];

  var filterNamesArray = Array.isArray(filterNames) ? filterNames : [filterNames];
  filterDefinitions.custom = customFilter;

  return postcss.plugin("postcss-node-extract", function () { return function (nodes) {
    nodes.walk(function (rule) {
      var filterRule = false;
      filterNamesArray.some(function (filterName) {
        filterRule = extractNodeRecursively(rule, filterDefinitions[filterName]);
        return filterRule;
      });
      if (!filterRule) { rule.remove(); }
    });
  }; });
}

/**
 * Default options.
 *
 * @type {Object}
 */
var defaultOptions = {
  css: "",
  filterNames: [],
  customFilter: undefined,
  postcssSyntax: undefined,
};

/**
 * CssNodeExtract
 */
var CssNodeExtract = function CssNodeExtract () {};

CssNodeExtract.process = function process (options) {
    if ( options === void 0 ) options = {};

  return new Promise(function (resolve) {
    var result = CssNodeExtract.processSync(options);
    resolve(result);
  });
};

/**
 * Synchronously extract nodes from a string.
 *
 * @param {Object} options
 * Configuration options.
 * @return {String}
 * Extracted nodes.
 */
CssNodeExtract.processSync = function processSync (options) {
    if ( options === void 0 ) options = {};

  var data = Object.assign({}, defaultOptions, options);
  return postcss(postcssNodeExtract(data.filterNames, data.customFilter))
    .process(data.css, { syntax: data.postcssSyntax }).css;
};

module.exports = CssNodeExtract;
