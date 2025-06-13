Overview:
Refactor the Next.js frontend to be a lean, high-conversion tool for attracting investors and ranking on search engines. Focus exclusively on ROI-driven copy and technical SEO optimization.

Core Objectives:

    Investor-Focused Copy: Replace vague features with credible, quantifiable ROI projections.

    Technical SEO Overhaul: Implement comprehensive, accurate metadata and search optimization.

    Performance Optimization: Eliminate unnecessary client-side code and ensure fast load times.

File Modifications
1. Layout and Metadata Optimization

File: /web/frontend/app/layout.tsx
Purpose: Implement master SEO metadata, Open Graph tags, and Twitter cards with correct domain and credible claims.

      
import "./globals.css"
import { ReactNode } from "react"
import { AuthProvider } from "@/context/AuthContext"
import { Navbar } from "@/components/ui/navbar"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://intelvis.ai'),
  title: "IntelVis | Industrial Compressed Air Leak Detection | Cut Energy Waste",
  description: "Continuous compressed air leak detection that cuts energy waste by up to 30%. Deploy IntelVis sensors for 24/7 monitoring, instant cost alerts, and projected ROI under 6 months. An Industrial IoT solution for predictive maintenance and ISO 50001.",
  keywords: "compressed air leak detection, energy efficiency monitoring, predictive maintenance, industrial IoT, ultrasonic leak detection, ISO 50001, ESG compliance, plant optimization, energy waste reduction",
  authors: [{ name: "IntelVis" }],
  creator: "IntelVis",
  publisher: "IntelVis",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://intelvis.ai",
    siteName: "IntelVis",
    title: "IntelVis | Cut Compressed Air Waste, Boost Your Bottom Line",
    description: "24/7 industrial leak detection to cut energy costs by up to 30%. Get your custom ROI projection.",
    images: [
      {
        url: "/og-image.webp", // NOTE: Add an image to /public/og-image.webp (1200x630px)
        width: 1200,
        height: 630,
        alt: "The IntelVis compressed air leak detection sensor and hardware components."
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "IntelVis | Cut Compressed Air Waste by up to 30%",
    description: "Continuous industrial leak detection. 24/7 monitoring, instant cost alerts, fast ROI.",
    images: ["/og-image.webp"]
  },
  alternates: {
    canonical: "https://intelvis.ai",
  }
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="min-h-screen">
        <AuthProvider>
          <Navbar />
          <div className="pt-16">{children}</div>
        </AuthProvider>
      </body>
    </html>
  )
}

    

IGNORE_WHEN_COPYING_START
Use code with caution. Tsx
IGNORE_WHEN_COPYING_END

File: /web/frontend/app/page.tsx
Purpose: Simplify the landing page component by removing redundant metadata, which is now correctly handled in layout.tsx.

      
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { CtaFormSection } from "@/components/landing/CtaFormSection";
import { WhoIsItForSection } from "@/components/landing/WhoIsItForSection";
import { WedgeInsightSection } from "@/components/landing/WedgeInsightSection";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-black text-white">
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black pointer-events-none" />
      
      <div className="relative z-10">
        <main id="main-content">
          <HeroSection />
          <WhoIsItForSection />
          <HowItWorksSection />
          <WedgeInsightSection />
          <CtaFormSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}

    

IGNORE_WHEN_COPYING_START
Use code with caution. Tsx
IGNORE_WHEN_COPYING_END
2. Landing Page Components - ROI-Focused Copy

File: /web/frontend/components/landing/HeroSection.tsx
Purpose: Rewrite hero copy to be credible and focused on ROI projections. Replace fake calculator with a powerful, direct example.

      
'use client';

import { useScrollAnimation, fadeInUpVariants } from '@/lib/useScrollAnimation';

export function HeroSection() {
  const { elementRef, isVisible } = useScrollAnimation<HTMLElement>();
  return (
    <section 
      ref={elementRef}
      className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-20"
    >
      <div className={`${fadeInUpVariants.hidden} ${isVisible ? fadeInUpVariants.visible : ''}`}>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-gray-50 leading-tight max-w-4xl">
          Cut Compressed Air Waste by 
          <span className="text-blue-500"> Up to 30%</span>
        </h1>
        <p className="text-lg md:text-2xl max-w-3xl mb-10 text-gray-300">
          <b>IntelVis</b> deploys 24/7 sensors that provide instant leak alerts with cost estimates. Target payback under 6 months.
        </p>
        <div className="mb-8">
          <div className="inline-block bg-gray-900 border border-gray-700 rounded-lg p-4 mb-6 text-left">
            <h3 className="text-blue-400 font-semibold mb-2 text-center">Example ROI Projection</h3>
            <p className="text-sm text-gray-300">
              A single <strong>10 CFM leak</strong> at $0.08/kWh costs <strong className="text-red-400">$2,880 annually</strong>.
              <br/>
              IntelVis finds it instantly.
            </p>
          </div>
        </div>
        <a
          href="#early-access-form"
          className="cta-pulse inline-block bg-blue-600 text-white text-lg font-semibold px-8 py-4 rounded-lg shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all transform hover:scale-105"
        >
          Get Your Custom ROI Projection
        </a>
        <p className="text-sm text-gray-500 mt-5">Pilot Program Q2 2025. Limited slots.</p>
      </div>
    </section>
  );
}

    

IGNORE_WHEN_COPYING_START
Use code with caution. Tsx
IGNORE_WHEN_COPYING_END

File: /web/frontend/components/landing/WhoIsItForSection.tsx
Purpose: Rewrite copy for credibility and remove unnecessary client-side hooks (useState, useEffect) to improve performance.

      
import { CheckCircle2 } from 'lucide-react';

const benefits = [
  "Your compressed air costs exceed $50K annually",
  "Production is impacted by pressure drops from leaks", 
  "You need verifiable data for ISO 50001 or ESG goals",
  "Manual audits are costly and miss intermittent leaks"
];

export function WhoIsItForSection() {
  return (
    <section className="py-20 md:py-28 px-4 border-t border-gray-900">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-gray-50">
          IntelVis Delivers Clear ROI When...
        </h2>
        <div className="grid md:grid-cols-2 gap-x-10 gap-y-6 max-w-4xl mx-auto text-lg text-left text-gray-300">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start space-x-4">
              <CheckCircle2 className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" aria-hidden="true" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
        <div className="mt-16 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-800/30 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-400 mb-3">Projected Financial Impact</h3>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-green-400">~30%</div>
              <div className="text-sm text-gray-400">Energy Waste Reduction</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400">< 6 mo</div>
              <div className="text-sm text-gray-400">Typical Payback Period</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400">24/7</div>
              <div className="text-sm text-gray-400">Monitoring Coverage</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

    

IGNORE_WHEN_COPYING_START
Use code with caution. Tsx
IGNORE_WHEN_COPYING_END

File: /web/frontend/components/landing/WedgeInsightSection.tsx
Purpose: Refine cost comparison to be direct and credible.

      
export function WedgeInsightSection() {
  return (
    <section className="py-20 md:py-28 px-4 border-t border-gray-900">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-xl md:text-2xl mb-6 text-gray-300 leading-relaxed">
          Traditional audits cost thousands, are performed infrequently, and miss intermittent leaks. This means profit is constantly draining between inspections.
        </p>
        <p className="text-2xl md:text-3xl text-gray-50 font-semibold leading-relaxed">
          IntelVis provides <span className="text-blue-500">continuous coverage</span> to catch the leaks manual audits miss, with <span className="text-blue-500">instant cost calculations</span>.
        </p>
        <div className="mt-12 grid md:grid-cols-2 gap-8 text-left">
          <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-6">
            <h4 className="text-red-400 font-semibold mb-3">Traditional Audits</h4>
            <ul className="space-y-2 text-gray-300">
              <li>• High cost per audit</li>
              <li>• Misses intermittent & new leaks</li>
              <li>• Point-in-time snapshot only</li>
              <li>• No ongoing data or alerts</li>
            </ul>
          </div>
          <div className="bg-green-900/20 border border-green-800/30 rounded-lg p-6">
            <h4 className="text-green-400 font-semibold mb-3">IntelVis System</h4>
            <ul className="space-y-2 text-gray-300">
              <li>• Low-cost, long-life sensors</li>
              <li>• Catches all leaks 24/7</li>
              <li>• Real-time alerts with cost data</li>
              <li>• Continuous plant-wide visibility</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

    

IGNORE_WHEN_COPYING_START
Use code with caution. Tsx
IGNORE_WHEN_COPYING_END

File: /web/frontend/components/landing/CtaFormSection.tsx
Purpose: Refine CTA copy for credibility and remove unnecessary client-side hooks.

      
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  role: z.string().min(1, { message: "Please select your role." }),
  notes: z.string().optional(),
});

export function CtaFormSection() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", role: "", notes: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formspreeUrl = "https://formspree.io/f/mwplaold"; // This should be in an env var, but for now this is fine.
    
    try {
      const response = await fetch(formspreeUrl, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(values)
      });

      if (response.ok) {
        toast.success("Thanks! We'll send your ROI projection within 24 hours.");
        form.reset();
      } else {
        toast.error("Submission failed. Please try again.");
      }
    } catch {
      toast.error("A network error occurred. Please check your connection.");
    }
  }

  return (
    <section id="early-access-form" className="py-20 md:py-28 px-4 border-t border-gray-900">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-50">Get Your Custom ROI Projection</h2>
        <p className="text-lg mb-10 text-gray-400">Join our pilot program. Provide your plant details and we will generate a custom ROI projection. No cost, no commitment.</p>
        
        <Card className="text-left p-6 md:p-8 bg-gray-950 border-gray-800">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
               <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel className="text-gray-400">Your Name</FormLabel><FormControl><Input placeholder="e.g., Jane Doe" {...field} className="bg-black border-gray-700 text-gray-50 placeholder:text-gray-600 focus-visible:ring-blue-500" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel className="text-gray-400">Your Work Email</FormLabel><FormControl><Input type="email" placeholder="jane.doe@company.com" {...field} className="bg-black border-gray-700 text-gray-50 placeholder:text-gray-600 focus-visible:ring-blue-500" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="role" render={({ field }) => (
                  <FormItem><FormLabel className="text-gray-400">Your Role</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger className="bg-black border-gray-700 text-gray-50 focus:ring-blue-500"><SelectValue placeholder="Select your role..." /></SelectTrigger></FormControl>
                      <SelectContent className="bg-gray-900 text-gray-50 border-gray-700"><SelectItem value="maintenance">Maintenance / Plant Operations</SelectItem><SelectItem value="consultant">Energy Auditor / Consultant</SelectItem><SelectItem value="engineer">Engineering / Management</SelectItem><SelectItem value="procurement">Procurement / Finance</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent>
                  </Select><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="notes" render={({ field }) => (
                  <FormItem><FormLabel className="text-gray-400">Annual Compressed Air Spend or Plant Size <span className="text-gray-500">(Optional)</span></FormLabel><FormControl><Textarea placeholder="e.g., $200K annual air costs, 500,000 sq ft facility..." {...field} className="bg-black border-gray-700 text-gray-50 placeholder:text-gray-600 focus-visible:ring-blue-500" /></FormControl><FormMessage /></FormItem>
              )} />
              <Button type="submit" className="w-full text-lg py-6 bg-blue-600 hover:bg-blue-500" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Get Custom ROI Projection"}
              </Button>
            </form>
          </Form>
        </Card>
      </div>
    </section>
  );
}

    

IGNORE_WHEN_COPYING_START
Use code with caution. Tsx
IGNORE_WHEN_COPYING_END
3. New Files - SEO Infrastructure

File: /web/frontend/app/sitemap.ts
Purpose: Generate XML sitemap for search engines with the correct domain.

      
import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://intelvis.ai',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}

    

IGNORE_WHEN_COPYING_START
Use code with caution. TypeScript
IGNORE_WHEN_COPYING_END

File: /web/frontend/public/robots.txt
Purpose: Allow search engine crawling and point to the sitemap with the correct domain.

      
User-agent: *
Allow: /

Sitemap: https://intelvis.ai/sitemap.xml

    

IGNORE_WHEN_COPYING_START
Use code with caution.