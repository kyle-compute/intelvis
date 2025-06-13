'use client';

import { useScrollAnimation, fadeInUpVariants } from '@/lib/useScrollAnimation';

export function HeroSection() {
  const { elementRef, isVisible } = useScrollAnimation<HTMLElement>();
  return (
    <section 
      ref={elementRef}
      className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-16 md:py-20"
    >
      <div className={`${fadeInUpVariants.hidden} ${isVisible ? fadeInUpVariants.visible : ''}`}>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-gray-50 leading-tight max-w-4xl">
          IntelVis Delivers a <span className="text-blue-500">2-6 Month</span> Payback
        </h1>
        <p className="text-lg md:text-2xl mb-10 text-gray-300 text-center max-w-3xl mx-auto">
          The U.S. Department of Energy confirms that 25-35% of compressed air energy is lost to leaks you can&apos;t hear. <b>IntelVis</b> provides continuous detection with instant cost calculations to capture these hidden losses.
        </p>
        <div className="mb-8">
          <div className="inline-block bg-gray-900 border border-gray-700 rounded-lg p-4 mb-6 text-left">
            <h3 className="text-blue-400 font-semibold mb-2 text-center">DOE-Based ROI Example</h3>
            <p className="text-sm text-gray-300">
              A single <strong>10 CFM leak</strong> at $0.08/kWh costs <strong className="text-red-400">$2,880 annually</strong>.
              <br/>
              IntelVis detects it instantly for rapid payback based on DOE loss data.
            </p>
          </div>
        </div>
        <a
          href="#early-access-form"
          className="cta-pulse inline-block bg-blue-600 text-white text-lg font-semibold px-8 py-4 rounded-lg shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all transform hover:scale-105"
        >
          Get My ROI Projection
        </a>
        <p className="text-sm text-gray-500 mt-5">Pilot Program Q2 2025. Limited slots.</p>
      </div>
    </section>
  );
}