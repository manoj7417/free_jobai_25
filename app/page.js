
import HeroSection from "@/components/hero-section";
import Features from "@/components/features-1";
import FooterSection from "@/components/footer";
import FAQsThree from "@/components/faqs-3";
import Pricing from "@/components/pricing";
import IntegrationsSection from "@/components/integrations-1";
import { HeroHeader } from "@/components/header";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroHeader />
      <main className="flex-1">
        <HeroSection />
        <Features />
        <IntegrationsSection />
        <Pricing />
        <FAQsThree />
      </main>
      <FooterSection />
    </div>
  );
}