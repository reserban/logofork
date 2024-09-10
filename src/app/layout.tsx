import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://packer.unzet.com"),
  keywords: ["startups", "tech"],
  title: {
    default: "Logo Packer - Pack Pack Pack",
    template: "%s",
  },
  description: "Pack your logo designs and seconds and deliver like a pro.",
  openGraph: {
    description: `Pack your logo designs and seconds and deliver like a pro.`,
    images: ["https://packer.unzet.com/og.jpg"],
  },
  icons: {
    icon: "/photos/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={dmSans.className}>{children}</body>
    </html>
  );
}
