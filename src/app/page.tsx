'use client';

import {Typography} from "@mui/joy";
import {useEffect} from "react";
import {getUrlsOnPage} from "../utils/scraper/serverParser";


const test = async () => {
  const urls = await getUrlsOnPage("https://www.usu.edu")
  console.log(urls);
}

export default function Home() {
  useEffect(() => {
    test();
  }, []);

  return <Typography level='h1'>Web Scraper</Typography>
}
