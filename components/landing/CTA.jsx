'use client';

import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section className="container py-12 md:py-24 lg:py-32">
      <div className="rounded-lg bg-gradient-to-r from-primary to-primary/80 text-white p-8 md:p-12">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl">
              Ready to build your perfect resume?
            </h2>
            <p className="text-primary-foreground/90 md:text-lg">
              Join thousands of professionals who have landed their dream jobs with our resume builder.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Button variant="secondary" size="lg">
              Get Started for Free
            </Button>
            <Button variant="outline" size="lg" className="bg-white text-primary hover:bg-white/90">
              View Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}