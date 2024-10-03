"use client";

import { FC, useContext, useMemo, useState } from "react";
import { ScraperContext } from "@/utils/scraper/ScraperContext";
import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
  Box,
  Input,
  Stack,
  Typography,
} from "@mui/joy";
import {
  IndexTree,
  ScrapeEntriesMap,
  ScrapeStatus,
} from "@/utils/scraper/Scraper.types";
import { collapseIndexTree } from "@/utils/scraper/helpers";

type ResultItemProps = {
  indexTree: IndexTree;
  scrapeEntriesMap: ScrapeEntriesMap | null;
  parentSegments: string[];
  domain: string;
};

const ResultItem: FC<ResultItemProps> = (props) => {
  const { indexTree, scrapeEntriesMap, parentSegments, domain } = props;

  return (
    <>
      {[...indexTree.entries()]
        .sort(([segmentA], [segmentB]) => segmentA.localeCompare(segmentB))
        .map(([segment, childIndexTree]) => {
          const segments = [...parentSegments, segment];
          const path = "/" + segments.join("/");
          const scrapeEntry = scrapeEntriesMap?.get(path);

          const typography = (
            <Typography
              style={{ display: "inline" }}
              color={
                scrapeEntry?.status === ScrapeStatus.ERROR
                  ? "danger"
                  : scrapeEntry?.status === ScrapeStatus.FETCHED
                    ? "success"
                    : undefined
              }
            >
              {segment}
            </Typography>
          );

          if (childIndexTree.size === 0) {
            return (
              <Box key={segment} style={{ marginLeft: 16 + 15 }}>
                {typography}
              </Box>
            );
          }

          return (
            <details key={segment} style={{ marginLeft: 16 }}>
              <summary>{typography}</summary>
              <ResultItem
                indexTree={childIndexTree}
                scrapeEntriesMap={scrapeEntriesMap}
                parentSegments={segments}
                domain={domain}
              />
            </details>
          );
        })}
    </>
  );
};

const ResultTree: FC = () => {
  const { domainMap, indexTree } = useContext(ScraperContext);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const processedEntries = useMemo(() => {
    return [...indexTree.entries()]
      .filter(([domain]) => domain.match(new RegExp(search, "i")))
      .sort(([domainA], [domainB]) => {
        const aName = domainA.split(".").reverse().join(".");
        const bName = domainB.split(".").reverse().join(".");
        return aName.localeCompare(bName);
      });
  }, [indexTree, search]);

  if (indexTree.size === 0) {
    return (
      <Typography level="body-md">
        No results yet. Use the sidebar to search discover pages.
      </Typography>
    );
  }

  return (
    <>
      <Input
        sx={{ maxWidth: 300, mb: 2 }}
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {processedEntries.length === 0 && (
        <Typography level="body-md">No results found.</Typography>
      )}

      <AccordionGroup size="sm">
        {processedEntries.map(([domain, childIndexTree], index) => {
          const scrapeEntry = domainMap.get(domain)?.get("/");
          const hasChildren = childIndexTree.size > 0;
          const childrenCount = hasChildren
            ? (domainMap.get(domain)?.size ?? 0)
            : 0;

          return (
            <Accordion
              key={domain}
              expanded={expandedIndex === index}
              onChange={() =>
                setExpandedIndex(expandedIndex === index ? null : index)
              }
              disabled={!hasChildren}
            >
              <AccordionSummary indicator={hasChildren ? undefined : null}>
                <Stack direction="row" alignItems="center">
                  <Typography
                    style={{ display: "inline" }}
                    color={
                      scrapeEntry?.status === ScrapeStatus.ERROR
                        ? "danger"
                        : scrapeEntry?.status === ScrapeStatus.FETCHED
                          ? "success"
                          : undefined
                    }
                  >
                    {domain} {childrenCount ? `(${childrenCount} paths)` : null}
                  </Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <ResultItem
                  indexTree={collapseIndexTree(childIndexTree)}
                  scrapeEntriesMap={domainMap.get(domain) ?? null}
                  parentSegments={[]}
                  domain={domain}
                />
              </AccordionDetails>
            </Accordion>
          );
        })}
      </AccordionGroup>
    </>
  );
};

export default ResultTree;
