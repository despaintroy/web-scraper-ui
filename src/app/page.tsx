'use client';

import {Button, Typography} from "@mui/joy";
import {useContext} from "react";
import {getPageUrls} from "../utils/scraper/serverParser";
import {ScraperContext} from "../utils/scraper/ScraperContext";


export default function Home() {
  const {addUrls} = useContext(ScraperContext)

  const onClick = async () => {
    getPageUrls(['https://lds.org', 'https://apple.com', 'https://usu.edu']).then(addUrls)
  }

  return <>
    <Typography level='h1'>Web Scraper</Typography>
    <Button onClick={onClick}>Test</Button>
  </>
}
