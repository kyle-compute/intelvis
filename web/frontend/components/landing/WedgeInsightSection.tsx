// frontend/components/landing/WedgeInsightSection.tsx

export function WedgeInsightSection() {
  return (
    <section className="py-16 md:py-24 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-xl md:text-2xl mb-6 text-gray-700 leading-relaxed">
          Leak detection today means expensive, episodic audits with handheld ultrasonic guns. That only works for the leaks you happen to find on that specific day.
        </p>
        <p className="text-2xl md:text-3xl text-gray-900 font-semibold leading-relaxed">
          IntelVis is different. It’s{' '}
          <span className="text-blue-600">continuous</span>,{' '}
          <span className="text-blue-600">passive</span>, and{' '}
          <span className="text-blue-600">affordable</span> enough to deploy across your entire plant.
        </p>
        <p className="text-xl md:text-2xl mt-6 text-gray-700 leading-relaxed">
          One sensor provides years of real-time coverage. No walking the plant. No shutdowns needed.
        </p>
      </div>
    </section>
  );
}