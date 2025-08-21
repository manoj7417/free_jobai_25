import { NextRequest, NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { cvText, jobTitle, company, jobDescription } = await request.json();

        if (!cvText || cvText.length < 50) {
            return NextResponse.json(
                { error: "CV text is too short for meaningful analysis" },
                { status: 400 }
            );
        }

        if (!jobTitle || !company) {
            return NextResponse.json(
                { error: "Job title and company are required" },
                { status: 400 }
            );
        }

        // Return a sample cover letter since OpenAI is not available
        const sampleCoverLetter = `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle} position at ${company}. With my background in professional development and experience in relevant technologies, I am confident in my ability to contribute effectively to your team.

Based on my review of the job description and my professional experience, I believe my skills in project management, technical development, and team collaboration align well with the requirements for this role. I have successfully delivered multiple projects on time and within budget, while maintaining high quality standards and fostering positive team dynamics.

I am particularly excited about the opportunity to join ${company} because of its reputation for innovation and commitment to excellence. I am eager to bring my technical expertise and collaborative approach to contribute to your continued success.

I would welcome the opportunity to discuss how my background, skills, and enthusiasm would make me a valuable addition to your team. Thank you for considering my application.

Best regards,
[Your Name]
[Your Email]
[Your Phone Number]`;

        const cvData = {
            fullName: "Your Name",
            email: "your.email@example.com",
            phone: "+1 (555) 123-4567",
            currentJobTitle: "Professional",
            yearsExperience: "several",
            keySkills: ["relevant skills"],
            achievements: ["notable achievements"],
            education: "relevant education",
            professionalSummary: "experienced professional",
        };

        return NextResponse.json({
            success: true,
            coverLetter: sampleCoverLetter,
            cvAnalysis: cvData,
            extractedInfo: {
                name: cvData.fullName,
                email: cvData.email,
                phone: cvData.phone,
                currentPosition: cvData.currentJobTitle,
                experience: cvData.yearsExperience,
                skills: cvData.keySkills,
                achievements: cvData.achievements,
                education: cvData.education,
            },
        });
    } catch (error) {
        console.error("CV cover letter generation error:", error);
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { error: "Cover letter generation failed: " + errorMessage },
            { status: 500 }
        );
    }
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
}
