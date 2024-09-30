"use server"

import axios from "axios";
import getUrls from "get-urls";

const TIMEOUT = 5000;

async function fetchPage(url: string) {
  return await axios
    .get<string>(url, {timeout: TIMEOUT})
    .then((res) => res.data);
}

export async function getUrlsOnPage(url: string) {
  const html = await fetchPage(url);
  return getUrls(html, {requireSchemeOrWww: true, stripHash: true, removeQueryParameters: true});
}
