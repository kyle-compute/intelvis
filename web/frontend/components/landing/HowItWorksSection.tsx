// frontend/components/landing/HowItWorksSection.tsx
"use client"; 
import dynamic from 'next/dynamic';

const ImageCarousel = dynamic(
  () => import('./ImageCarousel').then(mod => mod.ImageCarousel),
  { ssr: false, loading: () => <div className="w-full h-[418px] bg-gray-950 rounded-lg animate-pulse"></div> }
);

const ModelViewer = dynamic(
  () => import('./ModelViewer').then(mod => mod.ModelViewer),
  { ssr: false, loading: () => <div className="w-full h-[418px] bg-gray-950 rounded-lg animate-pulse"></div> }
);

export function HowItWorksSection() {
  return (
    <section className="py-20 md:py-28 px-4 border-t border-gray-900">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-50">From Hidden Problem to Actionable Alert</h2>
        
        <div className="grid md:grid-cols-3 gap-10 text-center mb-20">
          {[
            { title: "Mount in Minutes", description: "Zip-tie the sensor near any potential leak point. Two-year battery. No wires." },
            { title: "Listen Continuously", description: "The sensor passively monitors for the unique ultrasonic signature of a leak." },
            { title: "Get Notified", description: "Receive an immediate alert with the leak's estimated cost and location." }
          ].map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-800 text-gray-300 rounded-full font-bold text-xl mb-5">{index + 1}</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-100">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          <ImageCarousel />
          <ModelViewer />
        </div>
      </div>
    </section>
  );
}