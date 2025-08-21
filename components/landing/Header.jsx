'use client';

import { Button } from "@/components/ui/button";
import { NavigationMenu } from "@/components/ui/navigation-menu";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-6 hidden md:flex">
          <a href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">ResumeBuilder</span>
          </a>
          <nav className="flex items-center gap-4 text-sm lg:gap-6">
            <a
              href="#features"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Features
            </a>
            <a
              href="#templates"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Templates
            </a>
            <a
              href="#pricing"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Pricing
            </a>
            <a
              href="#faq"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              FAQ
            </a>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center">
            <Button variant="ghost" className="hidden md:inline-flex">
              Sign in
            </Button>
            <Button className="hidden md:inline-flex">
              Get Started
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}