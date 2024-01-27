import type { Metadata } from "next"
import { Inter as FontSans } from "next/font/google"
import "./styles/globals.css"
import Providers from "./components/Providers"
import { cn } from "@/lib/utils"
import Navbar from "./components/Navbar"
import { Toaster } from "@/components/ui/toaster"

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "GraphQL Authentication",
  description: "Authentication with Graphql and Nextjs",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body
        className={cn("bg-white text-gray-900 antialiased light min-h-screen", fontSans.className)}
      >
        <Providers>
          <Navbar />
          <main className='container w-full h-full relative'>{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
