// frontend/app/page.tsx
import { Metadata } from 'next';

// Import all your landing page sections
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { CtaFormSection } from "@/components/landing/CtaFormSection";
import { WhoIsItForSection } from "@/components/landing/WhoIsItForSection";
import { WedgeInsightSection } from "@/components/landing/WedgeInsightSection";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "IntelVis",
  description: "IntelVis finds compressed air leaks before they cost you thousands. Simple sensors, real-time alerts. No audits needed. Get early access.",
};

// This is now your root page component
export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Opaque gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-95 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-t from-blue-950/20 via-transparent to-purple-950/20 opacity-60 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        <main id="main-content">
        <HeroSection />
        <WhoIsItForSection />
        <HowItWorksSection />
        <WedgeInsightSection />
          <CtaFormSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
