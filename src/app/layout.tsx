import React from "react";
import type { Metadata } from "next";
import ThemeProvider from "../components/ThemeProvider";
import Navigation from "../components/Navigation";

export const metadata: Metadata = {
  title: "U+ OTT 플랫폼",
  description: "LG U+ 시그니처 디자인의 프리미엄 OTT 서비스",
  keywords: "OTT, 스트리밍, 영화, 드라마, 엔터테인먼트",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Pretendard:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>
          <Navigation />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}