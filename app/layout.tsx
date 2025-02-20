import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Interactive Quiz Platform",
  description: "A simple Next.js quiz application",
  icons:"/ideas.png"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* ✅ Add a Navbar for Navigation */}
        <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
          <Link href="/" className="text-lg font-bold">🏠 Home</Link>
          <Link href="/history" className="text-lg">📜 Quiz History</Link>
        </nav>

        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
