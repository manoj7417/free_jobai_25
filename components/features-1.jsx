import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Brain, TrendingUp, GraduationCap } from 'lucide-react'

export default function Features() {
    return (
        <section className="bg-zinc-50 py-16 md:py-32 dark:bg-transparent">
            <div className="@container mx-auto max-w-5xl px-6">
                <div className="text-center">
                    <h2 className="text-balance text-4xl font-semibold lg:text-5xl">AI Job Displacement Solutions</h2>
                    <p className="mt-4">Don't just worry about AI taking your job. Take control of your career with our comprehensive AI-powered tools designed for the future.</p>
                </div>
                <div
                    className="@min-4xl:max-w-full @min-4xl:grid-cols-3 mx-auto mt-8 grid max-w-sm gap-6 *:text-center md:mt-16">
                    <Card className="group shadow-zinc-950/5">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <Brain className="size-6" aria-hidden />
                            </CardDecorator>

                            <h3 className="mt-6 font-medium">AI Skills Assessment</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="text-sm">Identify which of your skills are "AI-proof" and which need upgrading with our comprehensive skills analysis.</p>
                            <ul className="mt-3 text-xs text-muted-foreground space-y-1">
                                <li>• AI-proof skill identification</li>
                                <li>• Skill vulnerability analysis</li>
                                <li>• Personalized recommendations</li>
                            </ul>
                            <p className="mt-3 text-xs font-medium text-blue-600">Coming Soon</p>
                        </CardContent>
                    </Card>

                    <Card className="group shadow-zinc-950/5">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <TrendingUp className="size-6" aria-hidden />
                            </CardDecorator>

                            <h3 className="mt-6 font-medium">Career Transition Planner</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="mt-3 text-sm">AI-powered recommendations for pivoting to AI-resistant roles with detailed transition roadmaps.</p>
                            <ul className="mt-3 text-xs text-muted-foreground space-y-1">
                                <li>• AI-resistant role suggestions</li>
                                <li>• Transition roadmap planning</li>
                                <li>• Market demand analysis</li>
                            </ul>
                            <p className="mt-3 text-xs font-medium text-blue-600">Coming Soon</p>
                        </CardContent>
                    </Card>

                    <Card className="group shadow-zinc-950/5">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <GraduationCap className="size-6" aria-hidden />
                            </CardDecorator>

                            <h3 className="mt-6 font-medium">Reskilling Pathways</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="mt-3 text-sm">Personalized learning tracks to make you more valuable alongside AI with progress tracking.</p>
                            <ul className="mt-3 text-xs text-muted-foreground space-y-1">
                                <li>• Personalized learning paths</li>
                                <li>• AI collaboration skills</li>
                                <li>• Progress tracking</li>
                            </ul>
                            <p className="mt-3 text-xs font-medium text-blue-600">Coming Soon</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}

const CardDecorator = ({
    children
}) => (
    <div
        className="relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:bg-white/5 dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
        <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div
            aria-hidden
            className="bg-radial to-background absolute inset-0 from-transparent to-75%" />
        <div
            className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t">{children}</div>
    </div>
)
