import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/Navbar"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "LearnPath — Story-Based Developer Learning",
  description:
    "Learn React, TypeScript, and more through real-world stories and situations. Built for developers who want to actually understand, not just memorize.",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-canvas text-ink antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  )
}
