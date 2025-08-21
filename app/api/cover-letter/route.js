import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

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

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json(
                { error: "OpenAI API key not configured" },
                { status: 500 }
            );
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        // First, analyze the CV to extract key information
        const cvAnalysis = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `You are an expert CV/resume analyzer. Extract key information from the CV that would be relevant for a cover letter.

EXTRACT THE FOLLOWING INFORMATION:
1. Full Name
2. Email Address
3. Phone Number
4. Current Job Title/Position
5. Years of Experience
6. Key Skills and Technologies
7. Notable Achievements/Accomplishments
8. Education Background
9. Professional Summary

RESPONSE FORMAT (JSON only):
{
  "fullName": "extracted name",
  "email": "extracted email address",
  "phone": "extracted phone number",
  "currentJobTitle": "current position",
  "yearsExperience": "X years",
  "keySkills": ["skill1", "skill2", "skill3"],
  "achievements": ["achievement1", "achievement2"],
  "education": "degree and institution",
  "professionalSummary": "brief professional summary"
}

Be accurate and extract only information that is clearly stated in the CV.`,
                },
                {
                    role: "user",
                    content: `Analyze this CV and extract key information:\n\n${cvText.substring(
                        0,
                        4000
                    )}`,
                },
            ],
            max_tokens: 1000,
            temperature: 0.1,
        });

        const cvAnalysisResponse = cvAnalysis.choices[0]?.message?.content?.trim();
        let cvData = {
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

        if (cvAnalysisResponse) {
            try {
                const parsed = JSON.parse(cvAnalysisResponse);
                cvData = {
                    fullName: parsed.fullName || "Your Name",
                    email: parsed.email || "your.email@example.com",
                    phone: parsed.phone || "+1 (555) 123-4567",
                    currentJobTitle: parsed.currentJobTitle || "Professional",
                    yearsExperience: parsed.yearsExperience || "several",
                    keySkills: Array.isArray(parsed.keySkills)
                        ? parsed.keySkills
                        : ["relevant skills"],
                    achievements: Array.isArray(parsed.achievements)
                        ? parsed.achievements
                        : ["notable achievements"],
                    education: parsed.education || "relevant education",
                    professionalSummary:
                        parsed.professionalSummary || "experienced professional",
                };
            } catch (parseError) {
                console.error("Failed to parse CV analysis:", parseError);
            }
        }

        // Now generate a personalized cover letter
        const coverLetterPrompt = `Generate a professional, personalized cover letter based on the following information:

CANDIDATE INFORMATION (from CV):
- Name: ${cvData.fullName}
- Email: ${cvData.email}
- Phone: ${cvData.phone}
- Current Position: ${cvData.currentJobTitle}
- Years of Experience: ${cvData.yearsExperience}
- Key Skills: ${cvData.keySkills.join(", ")}
- Notable Achievements: ${cvData.achievements.join("; ")}
- Education: ${cvData.education}
- Professional Summary: ${cvData.professionalSummary}

JOB INFORMATION:
- Position: ${jobTitle}
- Company: ${company}
- Job Description: ${jobDescription || "Not provided"}

REQUIREMENTS:
1. Write a professional cover letter that matches the candidate's background to the job requirements
2. Use specific details from the CV to demonstrate relevant experience
3. Highlight key skills and achievements that align with the job
4. Show enthusiasm for the company and position
5. Keep it concise but comprehensive (3-4 paragraphs)
6. Use professional business writing style
7. Include contact information at the end

FORMAT:
- Start with "Dear Hiring Manager,"
- Include 3-4 well-structured paragraphs
- End with "Best regards," followed by the candidate's name
- Include the extracted email and phone number in the signature

Make the cover letter specific, professional, and compelling. Focus on how the candidate's experience and skills make them an ideal fit for this specific role at this specific company.`;

        const coverLetterGeneration = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content:
                        "You are an expert cover letter writer who creates compelling, personalized cover letters that match candidates to specific job opportunities.",
                },
                {
                    role: "user",
                    content: coverLetterPrompt,
                },
            ],
            max_tokens: 800,
            temperature: 0.7,
        });

        const coverLetter =
            coverLetterGeneration.choices[0]?.message?.content?.trim();

        if (!coverLetter) {
            return NextResponse.json(
                { error: "Failed to generate cover letter" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            coverLetter: coverLetter,
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
