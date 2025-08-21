import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import {
  Gemini,
  Replit,
  MagicUI,
  VSCodium,
  MediaWiki,
  GooglePaLM,
} from "@/components/logos";

export default function IntegrationsSection() {
  return (
    <section>
      <div className="py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <h2 className="text-balance text-3xl font-semibold md:text-4xl">
              Available Now
            </h2>
            <p className="text-muted-foreground mt-6">
              Start your AI-proof career journey with our current tools designed
              to give you the edge.
            </p>
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <IntegrationCard
              title="Resume Scanner"
              description="AI-powered resume analysis with comprehensive insights and improvement recommendations for better ATS compatibility."
            >
              <Gemini />
            </IntegrationCard>

            <IntegrationCard
              title="ATS Analysis"
              description="Optimize your resume for Applicant Tracking Systems with detailed keyword analysis and formatting recommendations."
            >
              <Replit />
            </IntegrationCard>

            <IntegrationCard
              title="Document Extractor"
              description="Extract and analyze information from various document formats to identify key skills and experience."
            >
              <MagicUI />
            </IntegrationCard>

            <IntegrationCard
              title="Cover Letter"
              description="Generate personalized cover letters that complement your resume and target specific job requirements."
            >
              <VSCodium />
            </IntegrationCard>

            <IntegrationCard
              title="Skills Assessment"
              description="Identify which of your skills are AI-proof and which need upgrading for future job security."
            >
              <MediaWiki />
            </IntegrationCard>

            <IntegrationCard
              title="Career Transition"
              description="Get AI-powered recommendations for pivoting to AI-resistant roles with detailed transition roadmaps."
            >
              <GooglePaLM />
            </IntegrationCard>
          </div>
        </div>
      </div>
    </section>
  );
}

const IntegrationCard = ({
  title,
  description,
  children,
  link = "https://github.com/meschacirung/cnblocks",
}) => {
  return (
    <Card className="p-6">
      <div className="relative">
        <div className="*:size-10">{children}</div>

        <div className="space-y-2 py-6">
          <h3 className="text-base font-medium">{title}</h3>
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {description}
          </p>
        </div>

        <div className="flex gap-3 border-t border-dashed pt-6">
          <Button
            asChild
            variant="secondary"
            size="sm"
            className="gap-1 pr-2 shadow-none"
          >
            <Link href={link}>
              Learn More
              <ChevronRight className="ml-0 !size-3.5 opacity-50" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};
