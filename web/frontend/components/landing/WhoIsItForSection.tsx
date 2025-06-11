// frontend/components/landing/WhoIsItForSection.tsx
"use client";
import { CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';

const benefits = [
  "You're tired of surprise leaks tanking system pressure.",
  "You run manual audits but know you're missing leaks.",
  "You’re trying to meet ESG or ISO-50001 targets.",
  "You’re a consultant who wants smarter diagnostics for clients."
];

export function WhoIsItForSection() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  return (
    <section className="py-20 md:py-28 px-4 border-t border-gray-900">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-gray-50">
          This is for you if...
        </h2>
        <div className="grid md:grid-cols-2 gap-x-10 gap-y-6 max-w-4xl mx-auto text-lg text-left text-gray-300">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start space-x-4">
              {isMounted ? (
                <CheckCircle2 className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" aria-hidden="true" />
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