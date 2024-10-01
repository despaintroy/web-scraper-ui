"use client";

import { Button, Container, Input, Typography } from "@mui/joy";
import { FormEventHandler, useContext, useState } from "react";
import { getPageUrls } from "@/utils/scraper/serverParser";
import { ScraperContext } from "@/utils/scraper/ScraperContext";
import ResultTree from "../components/ResultTree";

export default function Home() {
  const { addUrls } = useContext(ScraperContext);
  const [value, setValue] = useState("");

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const formattedUrl = value.startsWith("http") ? value : `https://${value}`;
    setValue("");
    await getPageUrls({ pages: formattedUrl, onlyLinks: true }).then(addUrls);
  };

  return (
    <Container maxWidth="md">
      <Typography level="h1">Web Scraper</Typography>
      <form onSubmit={onSubmit}>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          endDecorator={<Button type="submit">Submit</Button>}
        />
      </form>
      <ResultTree />
    </Container>
  );
}
