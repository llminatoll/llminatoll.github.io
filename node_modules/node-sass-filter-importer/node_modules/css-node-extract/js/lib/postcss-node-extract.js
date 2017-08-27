import postcss from 'postcss';
import extractNodeRecursively from './extract-node-recursively';
import filterDefinitions from './filter-definitions';

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
export default function postcssNodeExtract(filterNames = [], customFilter) {
  const filterNamesArray = Array.isArray(filterNames) ? filterNames : [filterNames];
  filterDefinitions.custom = customFilter;

  return postcss.plugin(`postcss-node-extract`, () => (nodes) => {
    nodes.walk((rule) => {
      let filterRule = false;
      filterNamesArray.some((filterName) => {
        filterRule = extractNodeRecursively(rule, filterDefinitions[filterName]);
        return filterRule;
      });
      if (!filterRule) rule.remove();
    });
  });
}
