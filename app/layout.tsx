import type { Metadata } from "next";
import { Chewy, Comic_Neue } from "next/font/google";
import "./globals.css";

const chewy = Chewy({
  variable: "--font-chewy",
  weight: "400",
  subsets: ["latin"],
});

const comicNeue = Comic_Neue({
  variable: "--font-comic-neue",
  weight: ["300", "400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Universe — A Cosmic Watercolor Collection",
  description: "A hand-painted journey across galaxies, stars and quiet cosmic wonder.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${comicNeue.variable} ${chewy.variable} antialiased bg-black`}
      >
        {children}
      </body>
    </html>
  );
}
