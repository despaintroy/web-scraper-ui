'use client';

import {FC, useContext} from "react";
import {ScraperContext} from "../utils/scraper/ScraperContext";
import {Typography} from "@mui/joy";
import {IndexTree, ScrapeEntriesMap} from "../utils/scraper/Scraper.types";

type ResultItemProps = {
  level: number
  indexTree: IndexTree
  scrapeEntriesMap: ScrapeEntriesMap | null
}

const ResultItem: FC<ResultItemProps> = (props) => {
  const {level, indexTree, scrapeEntriesMap} = props

  return (
    <>
      {[...indexTree.entries()].map(([segment, childIndexTree]) => (
        <details key={segment} style={{marginLeft: 16 * level}}>
          <summary>
            {/* TODO: Color code based on status */}
            <Typography>{segment}</Typography>
          </summary>
          <ResultItem level={level + 1} indexTree={childIndexTree} scrapeEntriesMap={scrapeEntriesMap}/>
        </details>
      ))}
    </>
  )
}

const ResultTree: FC = () => {
  const {domainMap, indexTree} = useContext(ScraperContext)

  return (<>
    <Typography level='h2'>{domainMap.size} Domains</Typography>

    {[...indexTree.entries()].map(([domain, childIndexTree]) => (
      <details key={domain}>
        <summary>{domain} ({domainMap.get(domain)?.size ?? 0} paths)</summary>
        <ResultItem level={1} indexTree={childIndexTree} scrapeEntriesMap={domainMap.get(domain) ?? null}/>
      </details>
    ))}
  </>)
}

export default ResultTree
