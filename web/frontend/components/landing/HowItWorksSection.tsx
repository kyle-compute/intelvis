'use client';
import dynamic from 'next/dynamic';
import { useScrollAnimation, fadeInUpVariants, scaleInVariants } from '@/lib/useScrollAnimation';

const ImageCarousel = dynamic(() => import('./ImageCarousel').then(mod => mod.ImageCarousel), {
  ssr: false,
  loading: () => <div className="h-[480px] w-full animate-pulse rounded-lg bg-gray-950"></div>,
});

export function HowItWorksSection() {
  const { elementRef: titleRef, isVisible: titleVisible } = useScrollAnimation<HTMLHeadingElement>();
  const { elementRef: stepsRef, isVisible: stepsVisible } = useScrollAnimation<HTMLDivElement>();
  const { elementRef: mediaRef, isVisible: mediaVisible } = useScrollAnimation<HTMLDivElement>();

  return (
    <section className="border-t border-gray-900 px-4 py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <h2 
          ref={titleRef}
          className={`mb-12 text-center text-3xl font-bold text-gray-50 md:text-4xl ${fadeInUpVariants.hidden} ${titleVisible ? fadeInUpVariants.visible : ''}`}
        >
          Reliable Hardware. 2-Year Battery. Zero Maintenance.
        </h2>

        <div 
          ref={stepsRef}
          className={`mb-16 grid gap-6 md:gap-8 text-center grid-cols-1 md:grid-cols-3 ${fadeInUpVariants.hidden} ${stepsVisible ? fadeInUpVariants.visible : ''}`}
        >
          {[
            { title: 'Deploy in Minutes', description: 'Magnetic mount or zip-tie near leak points. Industrial-grade housing.' },
            { title: 'Monitor 24/7', description: 'Ultrasonic sensors detect leaks continuously. 2-year battery life. No maintenance required.' },
            { title: 'Alert with Cost Data', description: 'Instant notifications with leak location and projected annual cost impact.' },
          ].map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
                {index + 1}
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-100">{step.title}</h3>
              <p className="text-gray-400 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        <div 
          ref={mediaRef}
          className={`flex justify-center ${scaleInVariants.hidden} ${mediaVisible ? scaleInVariants.visible : ''}`}
        >
          <div className="max-w-2xl">
            <ImageCarousel />
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-3 md:p-4">
              <div className="text-2xl font-bold text-blue-400">2 Years</div>
              <div className="text-sm text-gray-400">Battery Life</div>
            </div>
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-3 md:p-4">
              <div className="text-2xl font-bold text-green-400">5 Min</div>
              <div className="text-sm text-gray-400">Install Time</div>
            </div>
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-3 md:p-4">
              <div className="text-2xl font-bold text-yellow-400">Zero</div>
              <div className="text-sm text-gray-400">Maintenance</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}