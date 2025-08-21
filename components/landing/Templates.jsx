'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Templates() {
  const templates = [
    {
      id: 1,
      name: "Professional",
      description: "Clean and modern design for corporate roles",
    },
    {
      id: 2,
      name: "Creative",
      description: "Bold and expressive for creative industries",
    },
    {
      id: 3,
      name: "Minimalist",
      description: "Simple and elegant for any profession",
    },
    {
      id: 4,
      name: "Executive",
      description: "Sophisticated design for senior positions",
    },
  ];

  return (
    <section id="templates" className="container py-12 md:py-24 lg:py-32">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Professional Templates
          </h2>
          <p className="max-w-[600px] text-lg text-muted-foreground sm:text-xl">
            Choose from our collection of professionally designed templates.
          </p>
        </div>
      </div>
      
      <div className="mx-auto grid justify-center gap-6 sm:grid-cols-2 md:grid-cols-4 mt-12">
        {templates.map((template) => (
          <Card key={template.id} className="overflow-hidden transition-all hover:shadow-lg">
            <CardContent className="p-0">
              <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <div className="bg-white w-4/5 h-4/5 rounded-lg shadow-lg flex flex-col p-4">
                  <div className="h-2 bg-primary rounded mb-2 w-3/4"></div>
                  <div className="h-1 bg-muted rounded mb-1 w-full"></div>
                  <div className="h-1 bg-muted rounded mb-1 w-5/6"></div>
                  <div className="h-1 bg-muted rounded mb-4 w-4/5"></div>
                  
                  <div className="h-1 bg-primary rounded mb-1 w-1/2"></div>
                  <div className="h-1 bg-muted rounded mb-1 w-full"></div>
                  <div className="h-1 bg-muted rounded mb-1 w-5/6"></div>
                  <div className="h-1 bg-muted rounded mb-4 w-4/5"></div>
                  
                  <div className="h-1 bg-primary rounded mb-1 w-1/3"></div>
                  <div className="h-1 bg-muted rounded mb-1 w-full"></div>
                  <div className="h-1 bg-muted rounded mb-1 w-5/6"></div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{template.name}</h3>
                <p className="text-sm text-muted-foreground">{template.description}</p>
                <Button variant="link" className="p-0 mt-2 h-auto">Preview</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}