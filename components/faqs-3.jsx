'use client';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { DynamicIcon } from 'lucide-react/dynamic';
import Link from 'next/link'

export default function FAQsThree() {
    const faqItems = [
        {
            id: 'item-1',
            icon: 'brain',
            question: 'How does the AI resume scanner work?',
            answer: 'Our AI-powered resume scanner analyzes your resume using advanced natural language processing to identify skills, experience gaps, and optimization opportunities. It provides a comprehensive score (0-100) and actionable recommendations to improve your resume for better ATS compatibility and job market success.',
        },
        {
            id: 'item-2',
            icon: 'shield',
            question: 'Is my resume data secure and private?',
            answer: 'Yes, we take data security seriously. Your resume and personal information are encrypted and stored securely. We never share your data with third parties and you have full control over your information. You can delete your data at any time from your account settings.',
        },
        {
            id: 'item-3',
            icon: 'file-text',
            question: 'What file formats does the resume scanner support?',
            answer: 'Our resume scanner supports multiple formats including PDF, DOCX, and TXT files. We recommend using PDF format for the best results as it preserves formatting and ensures accurate analysis. The scanner can extract and analyze text from all supported formats.',
        },
        {
            id: 'item-4',
            icon: 'target',
            question: 'When will the AI Skills Assessment tool be available?',
            answer: 'The AI Skills Assessment tool is currently in development and will be available soon. This tool will help you identify which of your skills are "AI-proof" and which need upgrading. Sign up for our newsletter to get early access when it launches.',
        },
        {
            id: 'item-5',
            icon: 'trending-up',
            question: 'How can I prepare for AI-related career changes?',
            answer: 'Start by using our free resume scanner to understand your current skill gaps. When our Career Transition Planner launches, it will provide AI-powered recommendations for pivoting to AI-resistant roles with detailed transition roadmaps. Focus on developing skills that complement AI rather than compete with it.',
        },
        {
            id: 'item-6',
            icon: 'graduation-cap',
            question: 'What are "AI-proof" skills?',
            answer: 'AI-proof skills are those that are difficult to automate and remain valuable in an AI-driven workplace. These include creative thinking, emotional intelligence, complex problem-solving, leadership, and skills that require human judgment and interpersonal interaction. Our upcoming AI Skills Assessment will help you identify these in your profile.',
        },
    ]

    return (
        <section className="bg-muted dark:bg-background py-20">
            <div className="mx-auto max-w-5xl px-4 md:px-6">
                <div className="flex flex-col gap-10 md:flex-row md:gap-16">
                    <div className="md:w-1/3">
                        <div className="sticky top-20">
                            <h2 className="mt-4 text-3xl font-bold">Frequently Asked Questions</h2>
                            <p className="text-muted-foreground mt-4">
                                Can't find what you're looking for? Contact our{' '}
                                <Link href="#" className="text-primary font-medium hover:underline">
                                    customer support team
                                </Link>
                            </p>
                        </div>
                    </div>
                    <div className="md:w-2/3">
                        <Accordion type="single" collapsible className="w-full space-y-2">
                            {faqItems.map((item) => (
                                <AccordionItem
                                    key={item.id}
                                    value={item.id}
                                    className="bg-background shadow-xs rounded-lg border px-4 last:border-b">
                                    <AccordionTrigger className="cursor-pointer items-center py-5 hover:no-underline">
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-6">
                                                <DynamicIcon name={item.icon} className="m-auto size-4" />
                                            </div>
                                            <span className="text-base">{item.question}</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-5">
                                        <div className="px-9">
                                            <p className="text-base">{item.answer}</p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </div>
        </section>
    );
}
