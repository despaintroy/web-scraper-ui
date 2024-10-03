"use client";

import { FC, FormEventHandler, useContext, useState } from "react";
import { Button, Input } from "@mui/material";
import { ScraperContext } from "@/utils/scraper/ScraperContext";
import { getPageUrls } from "@/utils/scraper/serverParser";

const Sidebar: FC = () => {
  const { addUrls } = useContext(ScraperContext);
  const [value, setValue] = useState("");

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const formattedUrl = value.startsWith("http") ? value : `https://${value}`;
    setValue("");
    await getPageUrls({ pages: formattedUrl, onlyLinks: false }).then(addUrls);
  };

  return (
    <form onSubmit={onSubmit}>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        endDecorator={<Button type="submit">Submit</Button>}
      />
    </form>
  );
};

export default Sidebar;
