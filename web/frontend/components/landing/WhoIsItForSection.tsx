export function WhoIsItForSection() {
  return (
    <section className="py-12 md:py-16 lg:py-20 px-4 border-t border-gray-900">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-gray-50 text-center">
          Projected ROI by Facility Size
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Small Facility */}
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 md:p-6">
            <h3 className="text-xl font-bold text-blue-400 mb-4 text-center">Small Facility</h3>
            <div className="space-y-3 text-center mb-6">
              <div className="text-2xl font-bold text-gray-50">$50K-$200K</div>
              <div className="text-sm text-gray-400">Annual Air Costs</div>
            </div>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-gray-300">Projected Annual Losses:</dt>
                <dd className="text-red-400 font-semibold">$12K-$70K</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-300">IntelVis Investment:</dt>
                <dd className="text-gray-50">$15K-$25K</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-300">Projected Payback:</dt>
                <dd className="text-green-400 font-bold">2-6 months</dd>
              </div>
            </dl>
          </div>

          {/* Medium Facility */}
          <div className="bg-blue-900/20 border border-blue-600 rounded-lg p-6 transform md:scale-105">
            <div className="bg-blue-600 text-white text-xs font-bold py-1 px-3 rounded-full w-fit mx-auto mb-4">
              MOST COMMON
            </div>
            <h3 className="text-xl font-bold text-blue-400 mb-4 text-center">Medium Facility</h3>
            <div className="space-y-3 text-center mb-6">
              <div className="text-2xl font-bold text-gray-50">$200K-$500K</div>
              <div className="text-sm text-gray-400">Annual Air Costs</div>
            </div>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-gray-300">Projected Annual Losses:</dt>
                <dd className="text-red-400 font-semibold">$70K-$175K</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-300">IntelVis Investment:</dt>
                <dd className="text-gray-50">$25K-$40K</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-300">Projected Payback:</dt>
                <dd className="text-green-400 font-bold">2-4 months</dd>
              </div>
            </dl>
          </div>

          {/* Large Facility */}
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 md:p-6">
            <h3 className="text-xl font-bold text-blue-400 mb-4 text-center">Large Facility</h3>
            <div className="space-y-3 text-center mb-6">
              <div className="text-2xl font-bold text-gray-50">$500K+</div>
              <div className="text-sm text-gray-400">Annual Air Costs</div>
            </div>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-gray-300">Projected Annual Losses:</dt>
                <dd className="text-red-400 font-semibold">$175K+</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-300">IntelVis Investment:</dt>
                <dd className="text-gray-50">$40K-$60K</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-300">Projected Payback:</dt>
                <dd className="text-green-400 font-bold">2-3 months</dd>
              </div>
            </dl>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-400 mb-4">
            *Projections based on U.S. Department of Energy data showing 25-35% energy losses from compressed air leaks
          </p>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            These are <strong>projected</strong> results based on U.S. Department of Energy research. Actual ROI will depend on your specific facility conditions, energy costs, and leak severity.
          </p>
        </div>
      </div>
    </section>
  );
}