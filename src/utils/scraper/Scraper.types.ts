import { z } from "zod";

export enum ScrapeStatus {
  FOUND = "FOUND",
  FETCHED = "FETCHED",
  ERROR = "ERROR",
}

function coerceToMap<T>(value: T): T | Map<unknown, unknown> {
  if (Array.isArray(value)) return new Map(value);
  return value;
}

function coerceToSet<T>(value: T): T | Set<unknown> {
  if (Array.isArray(value)) return new Set(value);
  return value;
}

const ScrapeEntrySchema = z.object({
  status: z.nativeEnum(ScrapeStatus).catch(ScrapeStatus.FOUND),
  title: z.string().nullable().catch(null),
  description: z.string().nullable().catch(null),
  favorite: z.boolean().catch(false),
  referrers: z.preprocess(coerceToSet, z.set(z.string())).catch(new Set()),
});

const ScrapeEntriesMapSchema = z
  .preprocess(coerceToMap, z.map(z.string(), ScrapeEntrySchema))
  .catch(new Map()); // path -> ScrapeEntry

export const DomainMapSchema = z
  .preprocess(coerceToMap, z.map(z.string(), ScrapeEntriesMapSchema))
  .catch(new Map()); // domain -> ScrapeEntriesMap

export type ScrapeEntry = z.infer<typeof ScrapeEntrySchema>;
export type ScrapeEntriesMap = z.infer<typeof ScrapeEntriesMapSchema>;
export type DomainMap = z.infer<typeof DomainMapSchema>;

/**
 * Root level contains the domain name
 * Each subsequent level contains a path segment
 */
export type IndexTree = Map<string, IndexTree>;
