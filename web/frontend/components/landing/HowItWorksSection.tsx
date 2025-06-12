// frontend/components/landing/HowItWorksSection.tsx
'use client';
import dynamic from 'next/dynamic';
import { useScrollAnimation, fadeInUpVariants, scaleInVariants } from '@/lib/useScrollAnimation';

const ImageCarousel = dynamic(() => import('./ImageCarousel').then(mod => mod.ImageCarousel), {
  ssr: false,
  loading: () => <div className="h-[480px] w-full animate-pulse rounded-lg bg-gray-950"></div>,
});

const ModelViewer = dynamic(() => import('./ModelViewer'), {
  ssr: false,
  loading: () => <div className="h-[480px] w-full animate-pulse rounded-lg bg-gray-950"></div>,
});

export function HowItWorksSection() {
  const { elementRef: titleRef, isVisible: titleVisible } = useScrollAnimation<HTMLHeadingElement>();
  const { elementRef: stepsRef, isVisible: stepsVisible } = useScrollAnimation<HTMLDivElement>();
  const { elementRef: mediaRef, isVisible: mediaVisible } = useScrollAnimation<HTMLDivElement>();

  return (
    <section className="border-t border-gray-900 px-4 py-12 sm:py-20 md:py-28">
      <div className="mx-auto max-w-7xl">
        <h2 
          ref={titleRef}
          className={`mb-16 text-center text-3xl font-bold text-gray-50 md:text-4xl ${fadeInUpVariants.hidden} ${titleVisible ? fadeInUpVariants.visible : ''}`}
        >
          From Hidden Problem to Actionable Alert
        </h2>

        <div 
          ref={stepsRef}
          className={`mb-20 grid gap-10 text-center md:grid-cols-3 ${fadeInUpVariants.hidden} ${stepsVisible ? fadeInUpVariants.visible : ''}`}
        >
          {[
            { title: 'Mount in Minutes', description: 'Zip-tie the sensor near any potential leak point. Two-year battery. No wires.' },
            { title: 'Listen Continuously', description: 'The sensor passively monitors for the unique ultrasonic signature of a leak.' },
            { title: 'Get Notified', description: "Receive an immediate alert with the leak's estimated cost and location." },
          ].map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-gray-800 text-xl font-bold text-gray-300">
                {index + 1}
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-100">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>

        <div 
          ref={mediaRef}
          className={`grid items-stretch gap-10 md:grid-cols-2 ${scaleInVariants.hidden} ${mediaVisible ? scaleInVariants.visible : ''}`}
        >
          <ImageCarousel />
          <ModelViewer />
        </div>
      </div>
    </section>
  );
}