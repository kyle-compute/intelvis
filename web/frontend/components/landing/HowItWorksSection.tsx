// frontend/components/landing/HowItWorksSection.tsx
"use client"; // <-- This is critical. It marks this as a Client Component.

import dynamic from 'next/dynamic';

// Dynamically import the children components here, with SSR turned off.
// The loading placeholders prevent layout shift.
const ImageCarousel = dynamic(
  () => import('./ImageCarousel').then(mod => mod.ImageCarousel),
  { 
    ssr: false,
    loading: () => <div className="w-full max-w-md mx-auto h-[418px] bg-gray-200 rounded-lg animate-pulse"></div> 
  }
);

const ModelViewer = dynamic(
  () => import('./ModelViewer').then(mod => mod.ModelViewer),
  { 
    ssr: false,
    loading: () => <div className="w-full max-w-md mx-auto h-[418px] bg-gray-200 rounded-lg animate-pulse"></div>
  }
);

export function HowItWorksSection() {
  return (
    <section className="py-16 md:py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">From Hidden Problem to Actionable Alert</h2>
        
        <div className="grid md:grid-cols-3 gap-10 text-center mb-16">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-200 text-gray-700 rounded-full font-bold text-xl mb-4">1</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Mount in Minutes</h3>
            <p className="text-gray-600">Zip-tie the sensor near any potential leak point. Two-year battery. No wires.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-200 text-gray-700 rounded-full font-bold text-xl mb-4">2</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Listen Continuously</h3>
            <p className="text-gray-600">The sensor passively monitors for the unique ultrasonic signature of a leak.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-200 text-gray-700 rounded-full font-bold text-xl mb-4">3</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Get Notified</h3>
            <p className="text-gray-600">Receive an immediate alert with the leak's estimated cost and location.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* These components are now correctly loaded only on the client */}
          <ImageCarousel />
          <ModelViewer />
        </div>
      </div>
    </section>
  );
}