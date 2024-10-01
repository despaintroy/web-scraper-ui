import { DomainMap, IndexTree } from "./Scraper.types";

export const createIndexTree = (domainMap: DomainMap): IndexTree => {
  const indexTree = new Map<string, IndexTree>();

  for (const [domain, pathMap] of domainMap) {
    const domainNode = indexTree.get(domain) || new Map<string, IndexTree>();
    indexTree.set(domain, domainNode);

    for (const path of pathMap.keys()) {
      const pathSegments = path.split("/").filter(Boolean);
      let currentNode = domainNode;

      for (const segment of pathSegments) {
        const nextNode =
          currentNode.get(segment) || new Map<string, IndexTree>();
        currentNode.set(segment, nextNode);
        currentNode = nextNode;
      }
    }
  }

  return indexTree;
};

/**
 * Collapse consecutive segments with only one child into a single segment (separated by '/')
 */
export const collapseIndexTree = (indexTree: IndexTree): IndexTree => {
  const collapsedTree = new Map<string, IndexTree>();

  for (const [segment, childTree] of indexTree.entries()) {
    const collapsedChild = collapseIndexTree(childTree);

    if (collapsedChild.size === 1) {
      const [childSegment, grandChildTree] = [...collapsedChild.entries()][0];
      collapsedTree.set(`${segment}/${childSegment}`, grandChildTree);
    } else {
      collapsedTree.set(segment, collapsedChild);
    }
  }

  return collapsedTree;
};
