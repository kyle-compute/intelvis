// frontend/components/landing/WhoIsItForSection.tsx
"use client"; // <-- Step 1: Mark this as a Client Component.

import { CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react'; // <-- Step 2: Import hooks.

const benefits = [
  "You're tired of surprise leaks tanking system pressure.",
  "You run manual audits but know you're missing leaks.",
  "You’re trying to meet ESG or ISO-50001 targets.",
  "You’re a consultant who wants smarter diagnostics for clients."
];

export function WhoIsItForSection() {
  // Step 3: Use state to track if we are mounted on the client.
  const [isMounted, setIsMounted] = useState(false);

  // This effect runs only on the client, after the initial render.
  useEffect(() => {
    setIsMounted(true);
  }, []);


  return (
    <section className="py-16 md:py-24 px-4 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-gray-900">
          This is for you if...
        </h2>
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-5 max-w-3xl mx-auto text-lg text-left text-gray-800">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start space-x-3">
              {/* --- THE FIX IS HERE --- */}
              {/* Only render the icon if the component is mounted on the client. */}
              {/* Render a placeholder div to prevent layout shift. */}
              {isMounted ? (
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" aria-hidden="true" />
              ) : (
                <div className="w-6 h-6 flex-shrink-0"></div>
              )}
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}