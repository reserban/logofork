import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://logofork.com"),
  keywords: ["startups", "tech"],
  title: {
    default: "Logofork - Pack Pack Pack",
    template: "%s",
  },
  description: "Pack your logo designs in seconds and deliver like a pro.",
  openGraph: {
    description: `Pack your logo designs in seconds and deliver like a pro.`,
    images: ["https://logofork.com/og.jpg"],
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
    <html lang="en" className="bg-black">
      <head>
        <script
          defer
          src="https://data.unzet.com/script.js"
          data-website-id="91ddefe0-4137-4f82-94ac-2cde39d19f3d"
        ></script>
      </head>
      <body className={dmSans.className}>{children}</body>
    </html>
  );
}
