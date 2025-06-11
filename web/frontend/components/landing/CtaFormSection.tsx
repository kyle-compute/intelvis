// frontend/components/landing/CtaFormSection.tsx
"use client";
import { useState, useEffect } from "react"; // <-- Import useEffect
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
  const [formStatus, setFormStatus] = useState({ message: "", type: "" });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", role: "", notes: "" },
  });
  
  // --- THIS IS THE FIX ---
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  // --- END OF FIX ---

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // ... your onSubmit logic remains the same
  }

  return (
    <section id="early-access-form" className="py-16 md:py-24 px-4 bg-gray-100">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Shape the Future of Leak Detection</h2>
        <p className="text-lg mb-8 text-gray-700">Join the pilot program. No cost, no commitment. Just help us build the tool you actually want to use.</p>
        
        <Card className="text-left p-6 md:p-8">
          {/* --- THE FIX IS APPLIED HERE --- */}
          {/* Only render the form on the client to prevent any hydration errors from its children */}
          {isMounted ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl><Input placeholder="e.g., Jane Doe" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Your Work Email</FormLabel>
                        <FormControl><Input type="email" placeholder="jane.doe@company.com" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="role" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Your Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select your role..." /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="maintenance">Maintenance / Plant Ops</SelectItem>
                                <SelectItem value="consultant">Energy Auditor / Consultant</SelectItem>
                                <SelectItem value="engineer">Engineer / R&D / Management</SelectItem>
                                <SelectItem value="other">Curious Observer / Other</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="notes" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Biggest Compressed Air Challenge? <span className="text-gray-500">(Optional)</span></FormLabel>
                        <FormControl><Textarea placeholder="e.g., Finding intermittent leaks, cost justification..." {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                
                <Button type="submit" className="w-full text-lg py-6" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Get Early Access"}
                </Button>
                {formStatus.message && (
                  <p className={`text-sm text-center mt-4 ${formStatus.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {formStatus.message}
                  </p>
                )}
              </form>
            </Form>
          ) : (
            // Render a placeholder to prevent layout shift while the form loads
            <div className="h-[450px] w-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          )}
        </Card>
      </div>
    </section>
  );
}