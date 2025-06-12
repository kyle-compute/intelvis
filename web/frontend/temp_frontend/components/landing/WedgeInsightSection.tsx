// frontend/components/landing/WedgeInsightSection.tsx
export function WedgeInsightSection() {
  return (
    <section className="py-20 md:py-28 px-4 border-t border-gray-900">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-xl md:text-2xl mb-6 text-gray-300 leading-relaxed">
          Leak detection today means expensive, episodic audits with handheld ultrasonic guns. That only works for the leaks you happen to find on that specific day.
        </p>
        <p className="text-2xl md:text-3xl text-gray-50 font-semibold leading-relaxed">
          IntelVis is different. It’s{' '}
          <span className="text-blue-500">continuous</span>,{' '}
          <span className="text-blue-500">passive</span>, and{' '}
          <span className="text-blue-500">affordable</span> enough to deploy across your entire plant.
        </p>
      </div>
    </section>
  );
}