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
  if (!node[filter.property]) return false;
  if (node[filter.property] === filter.value) return true;
  if (filter.value instanceof RegExp && filter.value.test(node[filter.property])) return true;
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
export default function extractNodeRecursively(node, filterGroups) {
  if (node.parent && node.parent.type !== `root`) return extractNodeRecursively(node.parent, filterGroups);

  let extractNode = false;

  filterGroups.some((groupOrFilter) => {
    const filterGroup = Array.isArray(groupOrFilter) ? groupOrFilter : [groupOrFilter];
    extractNode = filterGroup.filter(
      filter => !nodeMatchesFilter(node, filter)
    ).length === 0;
    return extractNode;
  });

  return extractNode;
}
