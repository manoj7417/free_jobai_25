import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Star, Clock } from "lucide-react";

export default function Pricing() {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl space-y-6 text-center">
          <h1 className="text-center text-4xl font-semibold lg:text-5xl">
            Ready to Future-Proof Your Career?
          </h1>
          <p>
            Join thousands of professionals who are taking control of their AI
            future with our proven tools.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:mt-20 md:grid-cols-2 max-w-4xl mx-auto">
          <Card className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Star className="size-5 text-yellow-500" />
                <CardTitle className="font-medium">
                  Free Resume Scanner
                </CardTitle>
              </div>
              <span className="my-3 block text-2xl font-semibold">$0</span>
              <CardDescription className="text-sm">
                Available now - No credit card required
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <hr className="border-dashed" />

              <ul className="list-outside space-y-3 text-sm">
                {[
                  "AI-powered resume analysis",
                  "Multi-format support (PDF, DOCX, TXT)",
                  "Skills analysis (technical & soft skills)",
                  "Gap analysis with severity levels",
                  "Overall resume scoring (0-100)",
                  "Actionable improvement recommendations",
                  "Instant results",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="size-3 text-green-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="mt-auto">
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                <Link href="">Start Free Analysis</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="relative border-blue-200 dark:border-blue-800">
            <span className="bg-linear-to-br/increasing absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center rounded-full from-blue-400 to-blue-600 px-3 py-1 text-xs font-medium text-white ring-1 ring-inset ring-white/20 ring-offset-1 ring-offset-gray-950/5">
              <Clock className="size-3 mr-1" />
              Coming Soon
            </span>

            <div className="flex flex-col">
              <CardHeader>
                <CardTitle className="font-medium">
                  Premium AI Career Suite
                </CardTitle>
                <span className="my-3 block text-2xl font-semibold">
                  $19 / mo
                </span>
                <CardDescription className="text-sm">
                  Early access pricing - Limited time
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <hr className="border-dashed" />
                <ul className="list-outside space-y-3 text-sm">
                  {[
                    "Everything in Free Plan",
                    "AI Skills Assessment Tool",
                    "Career Transition Planner",
                    "Reskilling Pathways",
                    "Personalized learning tracks",
                    "Progress tracking & analytics",
                    "Priority customer support",
                    "Advanced ATS optimization",
                    "Cover letter generator",
                    "Interview preparation tools",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="size-3 text-green-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href="">Get Early Access</Link>
                </Button>
              </CardFooter>
            </div>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Join 10,000+ professionals • 4.9/5 rating • 85% average resume
            improvement
          </p>
        </div>
      </div>
    </section>
  );
}
