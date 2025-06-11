// frontend/components/landing/HeroSection.tsx
"use client";

export function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-16">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 leading-tight max-w-4xl">
        Compressed Air Leaks Are Costing You Thousands.
        <span className="text-blue-600"> Find Them Passively.</span>
      </h1>
      <p className="text-xl md:text-2xl max-w-3xl mb-8 text-gray-700">
        <b>IntelVis</b> uses a simple, long-life sensor to monitor your systems 24/7. No more manual audits. No more surprise pressure drops.
      </p>
      <a
        href="#early-access-form"
        className="cta-pulse inline-block bg-blue-600 text-white text-lg font-semibold px-8 py-3 rounded-md shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
      >
        Get Early Access
      </a>
      <p className="text-sm text-gray-500 mt-4">Pilot program Q2 2025. Limited slots.</p>
    </section>
  );
}