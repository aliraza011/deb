import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dialectic Agents",
  description: "A multi-agent theology and philosophy debate simulator."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
