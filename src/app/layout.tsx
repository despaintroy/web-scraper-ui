import type { Metadata, Viewport } from "next";
import React from "react";
import ThemeRegistry from "./ThemeRegistry";
import { ScraperProvider } from "@/utils/scraper/ScraperProvider";
import InitColorSchemeScript from "@mui/system/InitColorSchemeScript";

export const metadata: Metadata = {
  title: "Web Scraper UI",
};

export const viewport: Viewport = {
  // themeColor: '#9c7a53',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <InitColorSchemeScript defaultMode="dark" />
        <ScraperProvider>
          <ThemeRegistry options={{ key: "joy" }}>{children}</ThemeRegistry>
        </ScraperProvider>
      </body>
    </html>
  );
}
