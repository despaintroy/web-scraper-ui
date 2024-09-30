"use server"

import axios from "axios";
import getUrls from "get-urls";

const TIMEOUT = 5000;

async function fetchPage(url: string) {
  return await axios
    .get<string>(url, {timeout: TIMEOUT})
    .then((res) => res.data);
}

/**
 * Fetches the HTML of the given pages and returns a map of the page URLs to the URLs found on the page.
 * @param pages
 */
export async function getPageUrls(pages: string | string[]): Promise<Record<string, string[] | null>> {
  const pagesArr = Array.isArray(pages) ? pages : [pages];
  const htmls = await Promise.allSettled(pagesArr.map(fetchPage));
  const urls = htmls.map((html) => {
    if (html.status === "fulfilled") {
      return Array.from(getUrls(html.value, {requireSchemeOrWww: true, stripHash: true, removeQueryParameters: true}));
    } else {
      return null;
    }
  });
  return Object.fromEntries(pagesArr.map((page, i) => [page, urls[i]]));
}
