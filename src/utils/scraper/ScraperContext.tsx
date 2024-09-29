import {createContext} from "react";
import {DomainMap} from "./Scraper.types.ts";

type ScraperContextType = {
  domainMap: DomainMap;
  setDomainMap: (domainMap: DomainMap) => void;
}

export const ScraperContext = createContext<ScraperContextType>({
  domainMap: new Map(),
  setDomainMap: () => {
  },
});
