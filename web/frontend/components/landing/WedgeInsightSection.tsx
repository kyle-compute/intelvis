export function WedgeInsightSection() {
  return (
    <section className="py-12 md:py-16 lg:py-20 px-4 border-t border-gray-900">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-50 text-center">
          Doing Nothing is a Financial Decision
        </h2>
        <div className="bg-red-950/30 border border-red-800/50 rounded-lg p-4 md:p-6 mb-8">
          <p className="text-xl md:text-2xl text-red-300 font-semibold mb-4 text-center">
            The U.S. Department of Energy reports that 25-35% of compressed air energy is lost to leaks
          </p>
          <p className="text-lg text-gray-300 text-center max-w-3xl mx-auto">
            Every day you wait, you&apos;re choosing to lose thousands in energy costs. Manual audits catch only what technicians happen to find on that specific day. The U.S. Department of Energy research confirms that most facilities are hemorrhaging money through leaks they can&apos;t hear.
          </p>
        </div>
        <p className="text-2xl md:text-3xl text-gray-50 font-semibold leading-relaxed text-center max-w-3xl mx-auto">
          IntelVis provides <span className="text-blue-500">continuous coverage</span> based on DOE data, with <span className="text-blue-500">instant cost calculations</span> for projected rapid ROI.
        </p>
      </div>
    </section>
  );
}