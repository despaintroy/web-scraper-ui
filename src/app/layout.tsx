import type {Metadata, Viewport} from "next";
import React from "react";
import ThemeRegistry from "./ThemeRegistry";


export const metadata: Metadata = {
  title: "Web Scraper UI",
};

export const viewport: Viewport = {
  // themeColor: '#9c7a53',
}

export default function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
    <body>
    <ThemeRegistry options={{key: 'joy'}}>{children}</ThemeRegistry>
    </body>
    </html>
  );
}
