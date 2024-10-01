"use server";

import axios from "axios";
import getUrls from "get-urls";
import normalizeUrl, { Options as NormalizeUrlOptions } from "normalize-url";

const TIMEOUT = 5000;

const NORMALIZE_URL_OPTIONS: NormalizeUrlOptions = {
  stripHash: true,
  removeQueryParameters: true,
  stripWWW: true,
};

async function fetchPage(url: string) {
  return await axios
    .get<string>(url, { timeout: TIMEOUT })
    .then((res) => res.data);
}

/** Returns all URLs found in the given string */
function getAllUrls(str: string) {
  return Array.from(
    getUrls(str, { ...NORMALIZE_URL_OPTIONS, requireSchemeOrWww: true }),
  );
}

/** Returns all hrefs found in the given HTML */
function getAllLinks(html: string) {
  const links = new Set<string>();
  const regex = /href="([^"]*)"/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    links.add(match[1]);
  }
  return Array.from(links)
    .filter((url) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    })
    .map((link) => normalizeUrl(link, NORMALIZE_URL_OPTIONS));
}

type GetPageUrlsParams = {
  pages: string | string[];
  onlyLinks?: boolean;
};

/** Map page url -> found urls */
export type ScrapeRequestResult = Record<string, string[] | null>;

/** Fetches the HTML of the given pages and returns a map of the page URLs to the URLs found on the page */
export async function getPageUrls(
  params: GetPageUrlsParams,
): Promise<ScrapeRequestResult> {
  const { pages, onlyLinks } = params;

  const pagesArr = Array.isArray(pages) ? pages : [pages];
  const htmls = await Promise.allSettled(pagesArr.map(fetchPage));
  const urls = htmls.map((html) => {
    if (html.status === "fulfilled") {
      return onlyLinks ? getAllLinks(html.value) : getAllUrls(html.value);
    } else {
      return null;
    }
  });
  return Object.fromEntries(pagesArr.map((page, i) => [page, urls[i]]));
}
