import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AnalyticsProvider from "@/app/components/AnalyticsProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Mini Trello",
  description: "Simplified Trello clone",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-200`}
      >
        <AnalyticsProvider />
        {children}
      </body>
    </html>
  );
}
