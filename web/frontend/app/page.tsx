import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { CtaFormSection } from "@/components/landing/CtaFormSection";
import { WhoIsItForSection } from "@/components/landing/WhoIsItForSection";
import { WedgeInsightSection } from "@/components/landing/WedgeInsightSection";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-black text-white">
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black pointer-events-none" />
      
      <div className="relative z-10">
        <main id="main-content">
          <HeroSection />
          <WedgeInsightSection />
          <WhoIsItForSection />
          <HowItWorksSection />
          <CtaFormSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
