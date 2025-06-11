// frontend/components/landing/HeroSection.tsx
export function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-20">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-gray-50 leading-tight max-w-4xl">
        Compressed Air Leaks Are Costing You Thousands.
        <span className="text-blue-500"> Find Them Passively.</span>
      </h1>
      <p className="text-xl md:text-2xl max-w-3xl mb-10 text-gray-300">
        <b>IntelVis</b> uses a simple, long-life sensor to monitor your systems 24/7. No more manual audits. No more surprise pressure drops.
      </p>
      <a
        href="#early-access-form"
        className="cta-pulse inline-block bg-blue-600 text-white text-lg font-semibold px-8 py-4 rounded-lg shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all transform hover:scale-105"
      >
        Request Early Access
      </a>
      <p className="text-sm text-gray-500 mt-5">Pilot program Q2 2025. Limited slots.</p>
    </section>
  );
}