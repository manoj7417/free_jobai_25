'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Hero() {
  return (
    <section className="space-y-6 py-12 md:py-24 lg:py-32">
      <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
        <h1 className="font-bold text-3xl leading-tight sm:text-4xl md:text-5xl lg:text-6xl tracking-tighter">
          Build Your Perfect Resume in Minutes
        </h1>
        <p className="max-w-[46rem] text-lg text-muted-foreground sm:text-xl">
          Create professional, ATS-friendly resumes with our easy-to-use builder. 
          Choose from modern templates and land your dream job.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button size="lg">Get Started for Free</Button>
          <Button variant="outline" size="lg">View Templates</Button>
        </div>
      </div>
      
      <div className="container flex justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Create Your Resume</CardTitle>
            <CardDescription>
              Fill in your details and we'll generate a professional resume for you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName">First Name</label>
                <Input id="firstName" placeholder="John" />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName">Last Name</label>
                <Input id="lastName" placeholder="Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="email">Email</label>
              <Input id="email" type="email" placeholder="john.doe@example.com" />
            </div>
            <div className="space-y-2">
              <label htmlFor="summary">Professional Summary</label>
              <Textarea id="summary" placeholder="Briefly describe your professional background" />
            </div>
            <Button className="w-full">Create Resume</Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}