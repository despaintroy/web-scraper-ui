import {DomainMap, IndexTree} from "./Scraper.types";

export const createIndexTree = (domainMap: DomainMap): IndexTree => {
  const indexTree = new Map<string, IndexTree>();

  for (const [domain, pathMap] of domainMap) {
    const domainNode = indexTree.get(domain) || new Map<string, IndexTree>();
    indexTree.set(domain, domainNode);

    for (const path of pathMap.keys()) {
      const pathSegments = path.split("/").filter(Boolean);
      let currentNode = domainNode;

      for (const segment of pathSegments) {
        const nextNode = currentNode.get(segment) || new Map<string, IndexTree>();
        currentNode.set(segment, nextNode);
        currentNode = nextNode;
      }
    }
  }

  return indexTree;
}
