"use client";

import { HeroHeader } from "@/components/header";
import FooterSection from "@/components/footer";

export default function ToolsLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroHeader />
      <main className="flex-1 pt-20">
        {children}
      </main>
      <FooterSection />
    </div>
  );
}
