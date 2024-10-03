"use client";

import { FC, useContext } from "react";
import { ScraperContext } from "@/utils/scraper/ScraperContext";
import { getPageUrls } from "@/utils/scraper/serverParser";
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Stack,
} from "@mui/joy";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  url: z.preprocess(
    (val) =>
      typeof val === "string" && !val.startsWith("http")
        ? `https://${val}`
        : val,
    z.string().url(),
  ),
});

type FormValues = z.infer<typeof formSchema>;

const Sidebar: FC = () => {
  const { addUrls } = useContext(ScraperContext);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(formSchema) });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const { url } = data;
    await getPageUrls({ pages: url, mode: "hrefs" }).then(addUrls);
  };

  return (
    <Stack component="form" gap={2} onSubmit={handleSubmit(onSubmit)}>
      <FormControl error={!!errors.url}>
        <FormLabel>Starting URL</FormLabel>
        <Input {...register("url")} placeholder="https://example.com" />
        {errors.url && <FormHelperText>{errors.url.message}</FormHelperText>}
      </FormControl>

      <Button type="submit" fullWidth loading={isSubmitting}>
        Submit
      </Button>
    </Stack>
  );
};

export default Sidebar;
