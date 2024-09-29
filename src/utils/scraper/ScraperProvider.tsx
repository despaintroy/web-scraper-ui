import {FC, PropsWithChildren, useState} from "react";
import {ScraperContext} from "./ScraperContext.tsx";
import {DomainMap, DomainMapSchema} from "./Scraper.types.ts";

const DOMAIN_MAP_STORAGE_KEY = 'scraper-results';

export const ScraperProvider: FC<PropsWithChildren> = ({children}) => {
  const [domainMap, setDomainMap] = useState<DomainMap>(() => {
    const storageData = localStorage.getItem(DOMAIN_MAP_STORAGE_KEY);

    const parsed = JSON.parse(storageData || 'null');
    return DomainMapSchema.parse(parsed);
  });

  return (
    <ScraperContext.Provider value={{domainMap, setDomainMap}}>
      {children}
    </ScraperContext.Provider>
  );
}
