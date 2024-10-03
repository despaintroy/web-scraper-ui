"use server";

import axios from "axios";
import getUrls from "get-urls";
import normalizeUrl, { Options as NormalizeUrlOptions } from "normalize-url";
import { JSDOM } from "jsdom";

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

/** Returns all anchor hrefs found in the given HTML */
function getAllHrefs(html: string, baseOrigin: string) {
  const dom = new JSDOM(html);
  const anchors = dom.window.document.querySelectorAll("a");
  const urls = new Set<string>();
  anchors.forEach((anchor) => {
    const href = new URL(anchor.href, baseOrigin).href;
    urls.add(normalizeUrl(href, NORMALIZE_URL_OPTIONS));
  });
  return Array.from(urls);
}

function getPageLanguage(html: string) {
  const dom = new JSDOM(html);
  return dom.window.document.documentElement.lang || null;
}

function getPageTitle(html: string) {
  const match = /<title>([^<]*)<\/title>/i.exec(html);
  return match ? match[1] : null;
}

function getPageDescription(html: string) {
  const match = /<meta name="description" content="([^"]*)"/i.exec(html);
  return match ? match[1] : null;
}

function isHTML(str: string) {
  return /<!DOCTYPE html>/i.test(str) || /<html/i.test(str);
}

export type PageInfo = {
  urls: string[];
  title: string | null;
  description: string | null;
  isHTML: boolean;
  language: string | null;
};

/** Map page url -> page info */
export type ScrapeRequestResult = Record<string, PageInfo | null>;

type GetPageUrlsParams = {
  pages: string | string[];
  mode: "hrefs" | "urls";
};

/** Fetches the HTML of the given pages and returns a map of the page URLs to the URLs found on the page */
export async function getPageUrls(
  params: GetPageUrlsParams,
): Promise<ScrapeRequestResult> {
  const { pages, mode } = params;

  const pagesArr = Array.isArray(pages) ? pages : [pages];
  const results = await Promise.allSettled(pagesArr.map(fetchPage));

  return Object.fromEntries(
    pagesArr
      .map((page) => normalizeUrl(page, NORMALIZE_URL_OPTIONS))
      .map((page, i) => {
        const sourceResult = results[i];
        let baseOrigin;
        try {
          baseOrigin = new URL(page).origin;
        } catch {
          baseOrigin = null;
        }
        if (sourceResult.status === "rejected" || !baseOrigin)
          return [page, null];
        const source = sourceResult.value;

        return [
          page,
          {
            urls:
              mode === "hrefs"
                ? getAllHrefs(source, baseOrigin)
                : getAllUrls(source),
            title: getPageTitle(source),
            description: getPageDescription(source),
            isHTML: isHTML(source),
            language: getPageLanguage(source),
          },
        ];
      }),
  );
}
