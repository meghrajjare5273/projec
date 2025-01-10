import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ProjecTree",
  description: "A Domain For Interactions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="slide-out-to-left-5">{children}</body>
    </html>
  );
}
