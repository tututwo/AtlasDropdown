export function sortHierarchy(data) {
  const parentMap = new Map();
  data.forEach((item) => {
    if (!parentMap.has(item.parent)) {
      parentMap.set(item.parent, []);
    }
    parentMap.get(item.parent).push(item);
  });

  // Sort function for items
  const sortItems = (a, b) => a.id - b.id;

  // Flatten the data while maintaining the hierarchy
  const flattenData = (parentId) => {
    if (!parentMap.has(parentId)) return [];

    const children = parentMap.get(parentId);
    children.sort(sortItems);

    return children.flatMap((child) => [child, ...flattenData(child.id)]);
  };

  // Assuming null is the top-level parent for regions
  const sortedData = flattenData(null);

  return sortedData;
}
