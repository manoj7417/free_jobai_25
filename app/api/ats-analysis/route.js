import { NextRequest, NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { content, targetRole } = await request.json();

    if (!content) {
      return NextResponse.json({ error: 'Resume content is required' }, { status: 400 });
    }

    // Return mock analysis since OpenAI is not available
    return NextResponse.json({
      overallScore: 78,
      parseRate: 85,
      keywordScore: 72,
      formatScore: 90,
      originalContent: content,
      optimizedContent: `OPTIMIZED VERSION OF YOUR RESUME

JOHN DOE
Software Engineer | john.doe@email.com | (555) 123-4567 | linkedin.com/in/johndoe

PROFESSIONAL SUMMARY
Results-driven Software Engineer with 5+ years of experience developing scalable web applications using React, Node.js, and MongoDB. Proven track record of delivering high-quality software solutions that improve user experience and business outcomes.

TECHNICAL SKILLS
• Programming Languages: JavaScript (ES6+), TypeScript, Python, Java
• Frontend: React.js, Next.js, HTML5, CSS3, Tailwind CSS, Redux
• Backend: Node.js, Express.js, RESTful APIs, GraphQL
• Databases: MongoDB, PostgreSQL, Redis
• DevOps: Docker, AWS, CI/CD, Git, GitHub Actions
• Testing: Jest, React Testing Library, Cypress

PROFESSIONAL EXPERIENCE

Senior Software Engineer | TechCorp Inc. | 2022 - Present
• Developed and maintained 5+ React-based web applications, improving user engagement by 40%
• Led a team of 3 developers in implementing microservices architecture using Node.js and MongoDB
• Optimized database queries resulting in 60% faster page load times
• Implemented CI/CD pipelines using GitHub Actions, reducing deployment time by 70%
• Collaborated with UX designers to create responsive, accessible interfaces using Tailwind CSS

Software Engineer | StartupXYZ | 2020 - 2022
• Built RESTful APIs using Node.js and Express.js serving 10,000+ daily requests
• Integrated third-party services (Stripe, SendGrid) improving payment processing efficiency
• Implemented automated testing with Jest and Cypress, achieving 90% code coverage
• Deployed applications on AWS using Docker containers and managed infrastructure

EDUCATION
Bachelor of Science in Computer Science | University of Technology | 2020

CERTIFICATIONS
• AWS Certified Developer Associate
• MongoDB Certified Developer

[This is a sample optimization. Add your OpenAI API key to enable AI-powered analysis.]`,
      keywordAnalysis: {
        exactMatches: [
          { keyword: "JavaScript", count: 3, weight: 100 },
          { keyword: "React", count: 2, weight: 100 },
          { keyword: "Node.js", count: 1, weight: 100 },
          { keyword: "MongoDB", count: 1, weight: 100 }
        ],
        synonyms: [
          { keyword: "Frontend Development", original: "Web Development", weight: 80 },
          { keyword: "Backend Systems", original: "Server-side", weight: 80 },
          { keyword: "Database Management", original: "Data Storage", weight: 80 }
        ],
        relatedTerms: [
          { keyword: "API Development", relevance: "High", weight: 60 },
          { keyword: "RESTful Services", relevance: "Medium", weight: 60 },
          { keyword: "Microservices", relevance: "Medium", weight: 60 }
        ],
        contextRelevance: [
          { keyword: "Agile Methodology", context: "Project Management", weight: 35 },
          { keyword: "CI/CD", context: "DevOps", weight: 25 },
          { keyword: "Docker", context: "Containerization", weight: 30 }
        ],
        densityAnalysis: {
          overallDensity: 2.8,
          recommendedDensity: 2.5,
          status: "optimal",
          suggestions: [
            "Keyword density is well-balanced",
            "No keyword stuffing detected"
          ]
        },
        industryAlignment: {
          score: 75,
          matchedTerms: ["Software Engineering", "Web Development", "Full Stack"],
          missingTerms: ["Machine Learning", "Cloud Computing", "DevOps"],
          suggestions: [
            "Consider adding cloud platform experience",
            "Include DevOps practices if applicable",
            "Mention any AI/ML experience"
          ]
        }
      },
      recommendations: [
        "Add more industry-specific keywords like 'Machine Learning' and 'Cloud Computing'",
        "Simplify formatting for better ATS parsing",
        "Include quantifiable achievements",
        "Use standard section headings",
        "Consider adding DevOps and CI/CD experience"
      ],
      checks: [
        { name: "File Format", status: "pass", score: 95 },
        { name: "Keywords", status: "warning", score: 72 },
        { name: "Contact Info", status: "pass", score: 100 },
        { name: "Section Headers", status: "pass", score: 90 },
        { name: "Bullet Points", status: "warning", score: 75 },
        { name: "Keyword Density", status: "pass", score: 85 },
        { name: "Industry Alignment", status: "warning", score: 75 }
      ]
    });

  } catch (error) {
    console.error('ATS Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze resume' },
      { status: 500 }
    );
  }
}
