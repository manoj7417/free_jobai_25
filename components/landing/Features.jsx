'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeCheck, FileText, Sparkles, Zap } from "lucide-react";

export default function Features() {
  const features = [
    {
      title: "Professional Templates",
      description: "Choose from a variety of modern, ATS-friendly templates designed by professionals.",
      icon: <FileText className="h-6 w-6" />,
    },
    {
      title: "ATS Optimized",
      description: "Our resumes are optimized to pass through Applicant Tracking Systems.",
      icon: <BadgeCheck className="h-6 w-6" />,
    },
    {
      title: "Easy to Use",
      description: "Create a professional resume in minutes with our intuitive interface.",
      icon: <Zap className="h-6 w-6" />,
    },
    {
      title: "Export Options",
      description: "Download your resume as PDF, Word, or plain text formats.",
      icon: <Sparkles className="h-6 w-6" />,
    },
  ];

  return (
    <section id="features" className="container py-12 md:py-24 lg:py-32">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Powerful Features
          </h2>
          <p className="max-w-[600px] text-lg text-muted-foreground sm:text-xl">
            Everything you need to create a professional resume that stands out.
          </p>
        </div>
      </div>
      
      <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-4 mt-12">
        {features.map((feature, index) => (
          <Card key={index} className="transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-center rounded-full bg-primary/10 p-3 w-12 h-12 mb-4">
                {feature.icon}
              </div>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}