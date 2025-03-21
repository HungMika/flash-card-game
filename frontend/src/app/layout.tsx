import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Khai báo biến CSS từ Google Fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flash Game - QR Learning",
  description: "Trò chơi học tập bằng mã QR cho học sinh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased bg-white text-black dark:bg-zinc-900 dark:text-white">
        {children}
      </body>
    </html>
  );
}
