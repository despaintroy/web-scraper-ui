import { createContext } from "react";
import { ScrapeRequestResult } from "./serverParser";
import { DomainMap, IndexTree } from "./Scraper.types";

type ScraperContextType = {
  addUrls(result: ScrapeRequestResult): void;
  indexTree: IndexTree;
  domainMap: DomainMap;
};

export const ScraperContext = createContext<ScraperContextType>({
  addUrls: () => {
    throw new Error("ScraperContext not provided");
  },
  indexTree: new Map(),
  domainMap: new Map(),
});
