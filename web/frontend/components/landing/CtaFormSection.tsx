// frontend/components/landing/CtaFormSection.tsx
"use client";
import { useState, useEffect } from "react";
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
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", role: "", notes: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // --- THIS IS THE FIX ---
    // We are using the exact, working URL from your original HTML file.
    const formspreeUrl = "https://formspree.io/f/mwplaold";
    
    try {
      const response = await fetch(formspreeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(values)
      });

      if (response.ok) {
        toast.success("Thanks! We'll be in touch.");
        form.reset(); // Clear the form on success
      } else {
        // Handle server-side errors from Formspree
        toast.error("Submission failed. Please try again later.");
      }
    } catch (error) {
      // Handle network errors
      toast.error("A network error occurred. Please check your connection.");
    }
  }

  return (
    <section id="early-access-form" className="py-20 md:py-28 px-4 border-t border-gray-900">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-50">Shape the Future of Leak Detection</h2>
        <p className="text-lg mb-10 text-gray-400">Join the pilot program. No cost, no commitment. Just help us build the tool you actually want to use.</p>
        
        <Card className="text-left p-6 md:p-8 bg-gray-950 border-gray-800">
          {isMounted ? (
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
                        <SelectContent className="bg-gray-900 text-gray-50 border-gray-700"><SelectItem value="maintenance">Maintenance / Plant Ops</SelectItem><SelectItem value="consultant">Energy Auditor / Consultant</SelectItem><SelectItem value="engineer">Engineer / R&D / Management</SelectItem><SelectItem value="other">Curious Observer / Other</SelectItem></SelectContent>
                    </Select><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="notes" render={({ field }) => (
                    <FormItem><FormLabel className="text-gray-400">Biggest Compressed Air Challenge? <span className="text-gray-500">(Optional)</span></FormLabel><FormControl><Textarea placeholder="e.g., Finding intermittent leaks..." {...field} className="bg-black border-gray-700 text-gray-50 placeholder:text-gray-600 focus-visible:ring-blue-500" /></FormControl><FormMessage /></FormItem>
                )} />
                <Button type="submit" className="w-full text-lg py-6 bg-blue-600 hover:bg-blue-500" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Request Early Access"}
                </Button>
              </form>
            </Form>
          ) : (
            <div className="h-[530px] w-full rounded-lg bg-gray-950 animate-pulse"></div>
          )}
        </Card>
      </div>
    </section>
  );
}