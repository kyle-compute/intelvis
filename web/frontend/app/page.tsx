// frontend/app/page.tsx
import { Metadata } from 'next';

// Import all section components normally.
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { CtaFormSection } from "@/components/landing/CtaFormSection";
import { WhoIsItForSection } from "@/components/landing/WhoIsItForSection";
import { WedgeInsightSection } from "@/components/landing/WedgeInsightSection";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "IntelVis: Stop Losing Thousands to Hidden Compressed Air Leaks",
  description: "IntelVis finds compressed air leaks before they cost you thousands. Simple sensors, real-time alerts. No audits needed. Get early access.",
  openGraph: {
    title: "IntelVis: Stop Losing Thousands to Hidden Compressed Air Leaks",
    description: "Simple sensors, real-time alerts. No audits needed.",
    url: "https://www.intelvis.ai", // Use your real domain
    siteName: 'IntelVis',
    images: [
      {
        url: 'https://www.intelvis.ai/og-image.jpg', // Host your own OG image
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "IntelVis: Stop Losing Thousands to Hidden Compressed Air Leaks",
    description: "Simple sensors, real-time alerts. No audits needed.",
    // creator: '@yourtwitterhandle',
    images: ['https://www.intelvis.ai/og-image.jpg'], // Must be an absolute URL
  },
}

export default function LandingPage() {
  return (
    <div className="bg-gray-50 text-black">
      {/* The Navbar from layout.tsx is automatically included */}
      <main id="main-content">
        <HeroSection />
        <WhoIsItForSection />
        <HowItWorksSection />
        <WedgeInsightSection />
        <CtaFormSection />
      </main>
      <Footer />
    </div>
  );
}