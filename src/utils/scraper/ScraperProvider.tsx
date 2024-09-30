'use client';

import {FC, PropsWithChildren, useCallback, useEffect, useState} from "react";
import {ScraperContext} from "./ScraperContext";
import {DomainMap, DomainMapSchema, IndexTree, ScrapeEntry, ScrapeStatus} from "./Scraper.types";
import {createIndexTree} from "./helpers";
import {ScrapeRequestResult} from "./serverParser";

const DOMAIN_MAP_STORAGE_KEY = 'scraper-results';

export const ScraperProvider: FC<PropsWithChildren> = ({children}) => {
  const [domainMap, setDomainMap] = useState<DomainMap>(new Map());
  const [indexTree, setIndexTree] = useState<IndexTree>(new Map());

  useEffect(() => {
    const storageData = localStorage.getItem(DOMAIN_MAP_STORAGE_KEY);

    const parsed = (() => {
      try {
        return JSON.parse(storageData || 'null');
      } catch {
        return null;
      }
    })()
    const parsedDomainMap = DomainMapSchema.parse(parsed);
    const indexTree = createIndexTree(parsedDomainMap);

    setDomainMap(parsedDomainMap);
    setIndexTree(indexTree);
  }, []);

  const addUrls = useCallback((result: ScrapeRequestResult) => {
    setDomainMap(prev => {
      const newDomainMap = new Map(prev);

      for (const [scrapedUrlString, foundUrlStrings] of Object.entries(result)) {
        const scrapedUrl = new URL(scrapedUrlString);
        const scrapedDomain = scrapedUrl.hostname;
        const scrapedPath = scrapedUrl.pathname;

        const scrapeEntries = newDomainMap.get(scrapedDomain) || new Map<string, ScrapeEntry>();
        newDomainMap.set(scrapedDomain, scrapeEntries);
        const entry = scrapeEntries.get(scrapedPath) || {
          status: ScrapeStatus.FOUND,
          title: null,
          description: null,
          favorite: false,
          referrers: new Set(),
        }
        entry.status = entry.status === ScrapeStatus.FOUND && foundUrlStrings == null
          ? ScrapeStatus.ERROR
          : ScrapeStatus.FETCHED;
        scrapeEntries.set(scrapedPath, entry);

        if (foundUrlStrings == null) continue;

        for (const foundUrlString of foundUrlStrings) {
          const foundUrl = new URL(foundUrlString);
          const foundDomain = foundUrl.hostname;
          const foundPath = foundUrl.pathname;

          const scrapeEntries = newDomainMap.get(foundDomain) || new Map<string, ScrapeEntry>();
          newDomainMap.set(foundDomain, scrapeEntries);

          if (scrapeEntries.has(foundPath)) {
            const entry = scrapeEntries.get(foundPath);
            entry?.referrers.add(scrapedUrlString);
            continue;
          }

          scrapeEntries.set(foundPath, {
            status: ScrapeStatus.FOUND,
            title: null,
            description: null,
            favorite: false,
            referrers: new Set([scrapedUrlString]),
          });
        }
      }

      return newDomainMap;
    })

    setIndexTree(prev => {
      const newIndexTree = new Map(prev);

      for (const foundUrlStrings of Object.values(result)) {
        for (const foundUrlString of (foundUrlStrings ?? [])) {
          const foundUrl = new URL(foundUrlString);
          const foundDomain = foundUrl.hostname;
          const foundPath = foundUrl.pathname;

          const domainEntry = newIndexTree.get(foundDomain) || new Map<string, IndexTree>();
          newIndexTree.set(foundDomain, domainEntry);
          const pathSegments = foundPath.split("/").filter(Boolean);

          let currentNode = domainEntry;
          for (const segment of pathSegments) {
            const nextNode = currentNode.get(segment) || new Map<string, IndexTree>();
            currentNode.set(segment, nextNode);
            currentNode = nextNode;
          }
        }
      }

      return newIndexTree;
    })
  }, []);

  return (
    <ScraperContext.Provider value={{addUrls, indexTree, domainMap}}>
      {children}
    </ScraperContext.Provider>
  );
}
