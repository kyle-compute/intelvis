import "./globals.css"
import { ReactNode } from "react"
import { AuthProvider } from "@/context/AuthContext"
import { Navbar } from "@/components/ui/navbar"
import type { Metadata, Viewport } from 'next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://intelvis.ai'),
  title: "IntelVis | 2-6 Month Payback Period | Industrial Compressed Air Leak Detection",
  description: "Projected 2-6 month payback period for compressed air leak detection. Based on DOE data showing 25-35% energy losses. Deploy IntelVis sensors for continuous monitoring and instant ROI calculations.",
  keywords: "compressed air leak detection, 2-6 month payback, DOE energy losses, industrial IoT, ultrasonic leak detection, ROI projection, energy waste reduction, predictive maintenance",
  authors: [{ name: "IntelVis" }],
  creator: "IntelVis",
  publisher: "IntelVis",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://intelvis.ai",
    siteName: "IntelVis",
    title: "IntelVis | Projected 2-6 Month Payback Period",
    description: "Stop losing 25-35% of your compressed air energy to leaks. Get your projected ROI model based on DOE data.",
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "IntelVis compressed air leak detection with projected 2-6 month payback period"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "IntelVis | Projected 2-6 Month Payback Period",
    description: "DOE data shows 25-35% energy losses from air leaks. Get your projected ROI model.",
    images: ["/og-image.webp"]
  },
  alternates: {
    canonical: "https://intelvis.ai",
  }
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="min-h-screen">
        <AuthProvider>
          <Navbar />
          <div className="pt-16">{children}</div>
        </AuthProvider>
      </body>
    </html>
  )
}
