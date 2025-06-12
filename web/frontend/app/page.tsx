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
const API_URL = process.env.NEXT_PUBLIC_API_URL;
// This is now your root page component
export default function LandingPage() {
  return (
    <div className="bg-black text-white">
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