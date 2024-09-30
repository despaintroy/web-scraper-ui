'use client';

import {FC, useContext} from "react";
import {ScraperContext} from "@/utils/scraper/ScraperContext";
import {Typography} from "@mui/joy";
import {IndexTree, ScrapeEntriesMap, ScrapeStatus} from "@/utils/scraper/Scraper.types";

type ResultItemProps = {
  indexTree: IndexTree
  scrapeEntriesMap: ScrapeEntriesMap | null
  parentSegments: string[]
  domain: string
}

const ResultItem: FC<ResultItemProps> = (props) => {
  const {indexTree, scrapeEntriesMap, parentSegments, domain} = props

  return (
    <>
      {[...indexTree.entries()].sort(
        ([segmentA], [segmentB]) => segmentA.localeCompare(segmentB)
      ).map(([segment, childIndexTree]) => {
        const segments = [...parentSegments, segment]
        const path = '/' + segments.join('/')
        const scrapeEntry = scrapeEntriesMap?.get(path)

        return (
          <details key={segment} style={{marginLeft: 16}}>
            <summary>
              <Typography style={{display: 'inline'}}
                          color={scrapeEntry?.status === ScrapeStatus.ERROR ? 'danger' : scrapeEntry?.status === ScrapeStatus.FETCHED ? 'success' : undefined}>{segment}</Typography>
            </summary>
            <ResultItem indexTree={childIndexTree} scrapeEntriesMap={scrapeEntriesMap} parentSegments={segments}
                        domain={domain}/>
          </details>
        )
      })}
    </>
  )
}

const ResultTree: FC = () => {
  const {domainMap, indexTree} = useContext(ScraperContext)

  return (<>
    <Typography level='h2'>{domainMap.size} Domains</Typography>

    {[...indexTree.entries()]
      .sort(([domainA], [domainB]) => {
        const aName = domainA.split('.').reverse().join('.')
        const bName = domainB.split('.').reverse().join('.')
        return aName.localeCompare(bName)
      })
      .map(([domain, childIndexTree]) => {
        const scrapeEntry = domainMap.get(domain)?.get('/')

        return (
          <details key={domain}>
            <summary>
              <Typography style={{display: 'inline'}}
                          color={scrapeEntry?.status === ScrapeStatus.ERROR ? 'danger' : scrapeEntry?.status === ScrapeStatus.FETCHED ? 'success' : undefined}>{domain} ({domainMap.get(domain)?.size ?? 0} paths)</Typography>
            </summary>
            <ResultItem indexTree={childIndexTree} scrapeEntriesMap={domainMap.get(domain) ?? null} parentSegments={[]}
                        domain={domain}/>
          </details>
        )
      })}
  </>)
}

export default ResultTree
