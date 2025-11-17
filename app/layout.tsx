import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Multi-Purpose Tools Hub - Free Online Tools",
  description: "All-in-one toolkit with PDF merger, YouTube downloader, image converter, note taking, drawing, and many more productivity tools. Free and works in your browser.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
