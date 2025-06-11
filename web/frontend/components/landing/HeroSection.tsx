// frontend/components/landing/HeroSection.tsx
export function HeroSection() {
  return (
    // Set position to relative to contain the absolute video
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 py-20 overflow-hidden">
      {/* Video Background */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/assets/hero-background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Dark overlay to ensure text is readable */}
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-70"></div>
      </div>

      {/* Content - sits on top of the video with z-10 */}
      <div className="relative z-10 flex flex-col items-center">
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
      </div>
    </section>
  );
}