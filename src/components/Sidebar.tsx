"use client";

import { FC, useContext } from "react";
import { ScraperContext } from "@/utils/scraper/ScraperContext";
import { getPageUrls } from "@/utils/scraper/serverParser";
import {
  Button,
  Checkbox,
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
  additionalSteps: z.coerce.number(),
  limitStepsToDomain: z.string(),
  onlyEnglish: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

const Sidebar: FC = () => {
  const { addUrls, domainMap } = useContext(ScraperContext);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { additionalSteps: 0 },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const { url, additionalSteps, limitStepsToDomain, onlyEnglish } = data;
    console.log(data);
    const pagesToFetch = new Set([url]);
    let currentStep = 0;

    while (true) {
      const results = await getPageUrls({
        pages: Array.from(pagesToFetch),
        mode: "hrefs",
      });
      addUrls(results);
      pagesToFetch.clear();
      currentStep++;
      if (currentStep > additionalSteps) break;

      for (const pageInfo of Object.values(results)) {
        if (onlyEnglish && !pageInfo?.language?.toLowerCase().startsWith("en"))
          continue;

        for (const urlString of pageInfo?.urls ?? []) {
          const { hostname, pathname } = new URL(urlString);
          if (limitStepsToDomain && !hostname.endsWith(limitStepsToDomain))
            continue;
          // TODO: Get pages from referrers
          if (domainMap.get(hostname)?.get(pathname)?.status === "FETCHED")
            continue;

          pagesToFetch.add(urlString);
        }
      }

      console.log("pagesToFetch", pagesToFetch);
    }
  };

  return (
    <Stack component="form" gap={2} onSubmit={handleSubmit(onSubmit)}>
      <FormControl error={!!errors.url}>
        <FormLabel>Starting URL</FormLabel>
        <Input {...register("url")} placeholder="https://example.com" />
        {errors.url && <FormHelperText>{errors.url.message}</FormHelperText>}
      </FormControl>

      <FormControl error={!!errors.additionalSteps}>
        <FormLabel>Additional Steps</FormLabel>
        <Input {...register("additionalSteps")} type="number" />
        {errors.additionalSteps && (
          <FormHelperText>{errors.additionalSteps.message}</FormHelperText>
        )}
      </FormControl>

      <FormControl error={!!errors.limitStepsToDomain}>
        <FormLabel>Limit Steps to Domain</FormLabel>
        <Input {...register("limitStepsToDomain")} placeholder="example.com" />
        {errors.limitStepsToDomain && (
          <FormHelperText>{errors.limitStepsToDomain.message}</FormHelperText>
        )}
      </FormControl>

      <FormControl error={!!errors.onlyEnglish}>
        <Checkbox label={"Only English"} {...register("onlyEnglish")} />
        {errors.onlyEnglish && (
          <FormHelperText>{errors.onlyEnglish.message}</FormHelperText>
        )}
      </FormControl>

      <Button type="submit" fullWidth loading={isSubmitting}>
        Submit
      </Button>
    </Stack>
  );
};

export default Sidebar;
