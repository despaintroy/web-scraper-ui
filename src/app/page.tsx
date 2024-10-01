'use client';

import {Button, Container, Typography} from "@mui/joy";
import {useContext} from "react";
import {getPageUrls} from "@/utils/scraper/serverParser";
import {ScraperContext} from "@/utils/scraper/ScraperContext";
import ResultTree from "../components/ResultTree";


export default function Home() {
  const {addUrls} = useContext(ScraperContext)

  const onClick = async () => {
    getPageUrls(['https://churchofjesuschrist.org', 'https://apple.com', 'https://usu.edu']).then(addUrls)
  }

  return <Container maxWidth='md'>
    <Typography level='h1'>Web Scraper</Typography>
    <Button onClick={onClick}>Test</Button>
    <ResultTree/>
  </Container>
}
