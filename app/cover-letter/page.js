"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    FileText,
    Download,
    Copy,
    Edit3,
    Sparkles,
    Target,
    CheckCircle,
    User,
    Building,
    Upload,
    File,
    ChevronRight,
    ChevronLeft,
    Save,
    ArrowLeft,
} from "lucide-react";
import { jsPDF } from "jspdf";
import ToolsLayout from "../tools-layout";
import Link from "next/link";


export default function CoverLetterPage() {
    const [activeOption, setActiveOption] = useState("form");
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        currentJobTitle: "",
        companyName: "",
        positionTitle: "",
        whyWantJob: "",
        yearsExperience: "",
        biggestAchievement: "",
        topSkills: "",
    });

    const [cvUploadData, setCvUploadData] = useState({
        cvFile: null,
        jobTitle: "",
        company: "",
        jobDescription: "",
    });

    const [generatedCoverLetter, setGeneratedCoverLetter] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [autoSaved, setAutoSaved] = useState(false);
    const [cvExtractedText, setCvExtractedText] = useState("");
    const [cvAnalysis, setCvAnalysis] = useState(null);

    // Load PDF.js on component mount
    useEffect(() => {
        const loadPDFJS = async () => {
            if (typeof window !== "undefined" && !window.pdfjsLib) {
                const script = document.createElement("script");
                script.src =
                    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
                script.onload = () => {
                    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
                        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
                };
                document.head.appendChild(script);
            }
        };
        loadPDFJS();
    }, []);

    // Auto-save functionality
    useEffect(() => {
        const timer = setTimeout(() => {
            if (Object.values(formData).some((value) => value !== "")) {
                localStorage.setItem("coverLetterFormData", JSON.stringify(formData));
                setAutoSaved(true);
                setTimeout(() => setAutoSaved(false), 2000);
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [formData]);

    // Load saved data on component mount
    useEffect(() => {
        const savedData = localStorage.getItem("coverLetterFormData");
        if (savedData) {
            setFormData(JSON.parse(savedData));
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCVInputChange = (e) => {
        const { name, value } = e.target;
        setCvUploadData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const extractTextFromPDF = async (file) => {
        try {
            if (!window.pdfjsLib) {
                throw new Error("PDF.js is not loaded yet. Please try again.");
            }

            const arrayBuffer = await file.arrayBuffer();
            const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer })
                .promise;

            let fullText = "";
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const textContent = await page.getTextContent();

                let pageText = "";
                textContent.items.forEach((item) => {
                    pageText += item.str + " ";
                });

                fullText += pageText.trim() + "\n\n";
            }

            return fullText.trim();
        } catch (error) {
            console.error("Error extracting PDF text:", error);
            throw new Error("Failed to extract text from PDF");
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file type
        if (
            file.type === "application/pdf" ||
            file.type === "application/msword" ||
            file.type ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
            setCvUploadData((prev) => ({ ...prev, cvFile: file }));

            // Extract text if it's a PDF
            if (file.type === "application/pdf") {
                try {
                    setIsUploading(true);
                    const extractedText = await extractTextFromPDF(file);
                    setCvExtractedText(extractedText);
                } catch (error) {
                    console.error("Failed to extract CV text:", error);
                } finally {
                    setIsUploading(false);
                }
            }
        }
    };

    const nextStep = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const generateCoverLetterFromForm = async () => {
        setIsGenerating(true);
        // Simulate API call
        setTimeout(() => {
            const coverLetter = `Dear Hiring Manager,

I am writing to express my strong interest in the ${formData.positionTitle} position at ${formData.companyName}. With my background as a ${formData.currentJobTitle} and ${formData.yearsExperience} years of relevant experience, I am confident in my ability to contribute significantly to your team.

${formData.whyWantJob}

Throughout my career, I have demonstrated ${formData.biggestAchievement}, which I believe aligns perfectly with the requirements of this role. My expertise in ${formData.topSkills} has been instrumental in my professional success and would be valuable to your organization.

I am particularly drawn to ${formData.companyName} because of its reputation for excellence and commitment to innovation. I am excited about the opportunity to bring my skills and passion to your organization and contribute to its continued success.

Thank you for considering my application. I look forward to discussing how my background, skills, and enthusiasm can benefit ${formData.companyName}.

Best regards,
${formData.fullName}
${formData.email}
${formData.phone}`;

            setGeneratedCoverLetter(coverLetter);
            setIsGenerating(false);
        }, 2000);
    };

    const generateCoverLetterFromCV = async () => {
        if (
            !cvUploadData.cvFile ||
            !cvUploadData.jobTitle ||
            !cvUploadData.company
        ) {
            return;
        }

        setIsGenerating(true);
        setIsUploading(true);

        try {
            // Extract text from CV if not already done
            let cvText = cvExtractedText;
            if (!cvText && cvUploadData.cvFile.type === "application/pdf") {
                cvText = await extractTextFromPDF(cvUploadData.cvFile);
                setCvExtractedText(cvText);
            }

            // If we still don't have text, show error
            if (!cvText) {
                throw new Error(
                    "Could not extract text from CV. Please ensure it's a readable PDF."
                );
            }

            // Call the CV analysis and cover letter generation API
            const response = await fetch("/api/cover-letter", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    cvText: cvText,
                    jobTitle: cvUploadData.jobTitle,
                    company: cvUploadData.company,
                    jobDescription: cvUploadData.jobDescription,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to generate cover letter");
            }

            const data = await response.json();

            if (data.success) {
                setGeneratedCoverLetter(data.coverLetter);
                setCvAnalysis(data.cvAnalysis);
            } else {
                throw new Error("Failed to generate cover letter");
            }
        } catch (error) {
            console.error("Error generating cover letter:", error);
            // Fallback to basic cover letter
            const fallbackCoverLetter = `Dear Hiring Manager,

I am writing to express my strong interest in the ${cvUploadData.jobTitle
                } position at ${cvUploadData.company
                }. After carefully reviewing the job description and analyzing my qualifications, I am confident that my background and skills align perfectly with your requirements.

Based on my CV analysis, I bring extensive experience in the relevant field and have demonstrated consistent success in similar roles. My background includes relevant qualifications and experience that directly relates to the responsibilities outlined in your job posting.

${cvUploadData.jobDescription
                    ? `I am particularly excited about this opportunity because it aligns with my career goals and professional interests.`
                    : ""
                }

I am confident that my combination of technical skills, industry experience, and passion for excellence would make me a valuable addition to your team at ${cvUploadData.company
                }.

Thank you for considering my application. I look forward to discussing how my background and enthusiasm can contribute to your organization's continued success.

Best regards,
[Your Name]`;

            setGeneratedCoverLetter(fallbackCoverLetter);
        } finally {
            setIsGenerating(false);
            setIsUploading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedCoverLetter);
    };

    const downloadCoverLetter = async () => {
        setIsDownloading(true);

        try {
            // Create a simple text-based PDF using jsPDF directly
            const pdf = new jsPDF("p", "mm", "a4");

            // Set font and size
            pdf.setFont("helvetica");
            pdf.setFontSize(12);

            // Set margins
            const margin = 20;
            const pageWidth = 210;
            const pageHeight = 297;
            const textWidth = pageWidth - 2 * margin;

            // Split text into lines that fit the page width
            const lines = pdf.splitTextToSize(generatedCoverLetter, textWidth);

            let yPosition = margin + 20;
            const lineHeight = 6;

            // Add each line to the PDF
            for (let i = 0; i < lines.length; i++) {
                // Check if we need a new page
                if (yPosition > pageHeight - margin) {
                    pdf.addPage();
                    yPosition = margin + 20;
                }

                pdf.text(lines[i], margin, yPosition);
                yPosition += lineHeight;
            }

            const fileName = `cover-letter-${activeOption === "cv-upload"
                ? cvUploadData.company
                : formData.companyName
                }.pdf`;

            pdf.save(fileName);
        } catch (error) {
            console.error("Error generating PDF:", error);
            // Fallback to text download if PDF generation fails
            const blob = new Blob([generatedCoverLetter], { type: "text/plain" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `cover-letter-${activeOption === "cv-upload"
                ? cvUploadData.company
                : formData.companyName
                }.txt`;
            a.click();
            window.URL.revokeObjectURL(url);
        } finally {
            setIsDownloading(false);
        }
    };

    const renderCoverLetterLayout = (content) => {
        return (
            <div className="bg-white p-8 border border-gray-300 shadow-sm rounded-lg">
                <div className="max-w-2xl mx-auto">
                    <div className="text-gray-800 font-serif leading-relaxed">
                        <pre className="whitespace-pre-wrap text-sm font-sans">
                            {content}
                        </pre>
                    </div>
                </div>
            </div>
        );
    };

    const renderStep1 = () => (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full name *
                </label>
                <Input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full"
                    maxLength={50}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email address *
                </label>
                <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="w-full"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone number *
                </label>
                <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                    className="w-full"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current job title *
                </label>
                <Input
                    name="currentJobTitle"
                    value={formData.currentJobTitle}
                    onChange={handleInputChange}
                    placeholder="e.g., Software Developer"
                    className="w-full"
                    maxLength={50}
                />
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company name * (where you&apos;re applying)
                </label>
                <Input
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="Tech Corp"
                    className="w-full"
                    maxLength={50}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position title * (job you want)
                </label>
                <Input
                    name="positionTitle"
                    value={formData.positionTitle}
                    onChange={handleInputChange}
                    placeholder="Senior Software Engineer"
                    className="w-full"
                    maxLength={50}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Why do you want this job? * (1-2 sentences)
                </label>
                <textarea
                    name="whyWantJob"
                    value={formData.whyWantJob}
                    onChange={handleInputChange}
                    placeholder="Example: I&apos;m interested in this role because it matches my React skills and offers growth opportunities."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    maxLength={200}
                />
                <p className="text-xs text-gray-500 mt-1">
                    {formData.whyWantJob.length}/200 characters
                </p>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years of relevant experience *
                </label>
                <select
                    name="yearsExperience"
                    value={formData.yearsExperience}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="">Select experience level</option>
                    <option value="0-1 years">0-1 years</option>
                    <option value="1-3 years">1-3 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5+ years">5+ years</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    What&apos;s your biggest achievement at work? * (1-2 sentences)
                </label>
                <textarea
                    name="biggestAchievement"
                    value={formData.biggestAchievement}
                    onChange={handleInputChange}
                    placeholder="Example: Led a team project that increased sales by 25%"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    maxLength={200}
                />
                <p className="text-xs text-gray-500 mt-1">
                    {formData.biggestAchievement.length}/200 characters
                </p>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Top 3 skills for this job *
                </label>
                <Input
                    name="topSkills"
                    value={formData.topSkills}
                    onChange={handleInputChange}
                    placeholder="e.g., React, Node.js, AWS"
                    className="w-full"
                    maxLength={100}
                />
            </div>
        </div>
    );

    const isStep1Valid =
        formData.fullName &&
        formData.email &&
        formData.phone &&
        formData.currentJobTitle;
    const isStep2Valid =
        formData.companyName && formData.positionTitle && formData.whyWantJob;
    const isStep3Valid =
        formData.yearsExperience &&
        formData.biggestAchievement &&
        formData.topSkills;
    const isFormComplete = isStep1Valid && isStep2Valid && isStep3Valid;

    return (
        <ToolsLayout>
            <div className="min-h-screen bg-gray-50">
               

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Hero Section */}
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-blue-100 text-blue-800 border border-blue-200">
                            <Sparkles className="w-4 h-4 mr-2" />
                            AI-Powered Cover Letter Generator
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Create Professional Cover Letters
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Choose your preferred method to generate personalized, AI-powered
                            cover letters that match job requirements.
                        </p>
                    </div>

                    {/* Option Toggle */}
                    <div className="flex justify-center mb-8">
                        <div className="bg-white p-1 rounded-lg shadow-sm border">
                            <div className="flex">
                                <button
                                    onClick={() => setActiveOption("form")}
                                    className={`px-6 py-3 rounded-md font-medium transition-all ${activeOption === "form"
                                        ? "bg-blue-600 text-white shadow-sm"
                                        : "text-gray-600 hover:text-gray-900"
                                        }`}
                                >
                                    <Edit3 className="w-4 h-4 inline mr-2" />
                                    Multi-Step Form
                                </button>
                                <button
                                    onClick={() => setActiveOption("cv-upload")}
                                    className={`px-6 py-3 rounded-md font-medium transition-all ${activeOption === "cv-upload"
                                        ? "bg-blue-600 text-white shadow-sm"
                                        : "text-gray-600 hover:text-gray-900"
                                        }`}
                                >
                                    <Upload className="w-4 h-4 inline mr-2" />
                                    CV Upload & Auto-Generation
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Auto-save indicator */}
                    {autoSaved && (
                        <div className="flex justify-center mb-4">
                            <Badge className="bg-green-100 text-green-800 border border-green-200">
                                <Save className="w-3 h-3 mr-1" />
                                Progress saved automatically
                            </Badge>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column - Form or CV Upload */}
                        <Card className="bg-white">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    {activeOption === "form" ? (
                                        <>
                                            <Edit3 className="w-5 h-5 mr-2" />
                                            Multi-Step Form ({currentStep} of 3)
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-5 h-5 mr-2" />
                                            CV Upload & Auto-Generation
                                        </>
                                    )}
                                </CardTitle>
                                <CardDescription>
                                    {activeOption === "form"
                                        ? "Complete 3 simple steps to generate your cover letter"
                                        : "Upload your CV and provide job details for AI-powered generation"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {activeOption === "form" ? (
                                    <div className="space-y-6">
                                        {/* Progress Bar */}
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${(currentStep / 3) * 100}%` }}
                                            ></div>
                                        </div>

                                        {/* Step Content */}
                                        <div className="min-h-[400px]">
                                            {currentStep === 1 && (
                                                <div>
                                                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                                                        <User className="w-4 h-4 mr-2" />
                                                        Step 1: Basic Info
                                                    </h3>
                                                    {renderStep1()}
                                                </div>
                                            )}
                                            {currentStep === 2 && (
                                                <div>
                                                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                                                        <Building className="w-4 h-4 mr-2" />
                                                        Step 2: Job Details
                                                    </h3>
                                                    {renderStep2()}
                                                </div>
                                            )}
                                            {currentStep === 3 && (
                                                <div>
                                                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                                                        <CheckCircle className="w-4 h-4 mr-2" />
                                                        Step 3: Your Experience
                                                    </h3>
                                                    {renderStep3()}
                                                </div>
                                            )}
                                        </div>

                                        {/* Navigation Buttons */}
                                        <div className="flex justify-between">
                                            <Button
                                                onClick={prevStep}
                                                disabled={currentStep === 1}
                                                variant="outline"
                                                className="flex items-center"
                                            >
                                                <ChevronLeft className="w-4 h-4 mr-2" />
                                                Previous
                                            </Button>

                                            {currentStep < 3 ? (
                                                <Button
                                                    onClick={nextStep}
                                                    disabled={
                                                        (currentStep === 1 && !isStep1Valid) ||
                                                        (currentStep === 2 && !isStep2Valid)
                                                    }
                                                    className="flex items-center"
                                                >
                                                    Next
                                                    <ChevronRight className="w-4 h-4 ml-2" />
                                                </Button>
                                            ) : (
                                                <Button
                                                    onClick={generateCoverLetterFromForm}
                                                    disabled={!isFormComplete || isGenerating}
                                                    className="flex items-center bg-blue-600 hover:bg-blue-700"
                                                >
                                                    {isGenerating ? (
                                                        <>
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                            Generating...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Sparkles className="w-4 h-4 mr-2" />
                                                            Generate Cover Letter
                                                        </>
                                                    )}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {/* CV Upload Section */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Upload your CV/Resume *
                                            </label>
                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                                                <input
                                                    type="file"
                                                    accept=".pdf,.doc,.docx"
                                                    onChange={handleFileUpload}
                                                    className="hidden"
                                                    id="cv-upload"
                                                />
                                                <label htmlFor="cv-upload" className="cursor-pointer">
                                                    {cvUploadData.cvFile ? (
                                                        <div className="flex items-center justify-center space-x-2">
                                                            <File className="w-8 h-8 text-green-600" />
                                                            <span className="text-green-600 font-medium">
                                                                {cvUploadData.cvFile.name}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                                            <p className="text-gray-600">
                                                                Click to upload or drag and drop
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                PDF, DOC, DOCX (max 10MB)
                                                            </p>
                                                        </div>
                                                    )}
                                                </label>
                                            </div>
                                        </div>

                                        {/* Job Details */}
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Job Title *
                                                </label>
                                                <Input
                                                    name="jobTitle"
                                                    value={cvUploadData.jobTitle}
                                                    onChange={handleCVInputChange}
                                                    placeholder="Software Engineer"
                                                    className="w-full"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Company Name *
                                                </label>
                                                <Input
                                                    name="company"
                                                    value={cvUploadData.company}
                                                    onChange={handleCVInputChange}
                                                    placeholder="Tech Corp"
                                                    className="w-full"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Job Description
                                                </label>
                                                <textarea
                                                    name="jobDescription"
                                                    value={cvUploadData.jobDescription}
                                                    onChange={handleCVInputChange}
                                                    placeholder="Paste the job description here for better customization..."
                                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    rows={4}
                                                />
                                            </div>
                                        </div>

                                        {/* CV Analysis Display */}
                                        {cvAnalysis && (
                                            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                                <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                                                    <FileText className="w-4 h-4 mr-2" />
                                                    CV Analysis Results
                                                </h4>
                                                <div className="space-y-2 text-sm">
                                                    <div>
                                                        <strong>Name:</strong> {cvAnalysis.fullName}
                                                    </div>
                                                    <div>
                                                        <strong>Email:</strong> {cvAnalysis.email}
                                                    </div>
                                                    <div>
                                                        <strong>Phone:</strong> {cvAnalysis.phone}
                                                    </div>
                                                    <div>
                                                        <strong>Current Position:</strong>{" "}
                                                        {cvAnalysis.currentJobTitle}
                                                    </div>
                                                    <div>
                                                        <strong>Experience:</strong>{" "}
                                                        {cvAnalysis.yearsExperience}
                                                    </div>
                                                    <div>
                                                        <strong>Education:</strong> {cvAnalysis.education}
                                                    </div>
                                                    {cvAnalysis.keySkills &&
                                                        cvAnalysis.keySkills.length > 0 && (
                                                            <div>
                                                                <strong>Key Skills:</strong>{" "}
                                                                {cvAnalysis.keySkills.slice(0, 5).join(", ")}
                                                                {cvAnalysis.keySkills.length > 5 &&
                                                                    ` +${cvAnalysis.keySkills.length - 5} more`}
                                                            </div>
                                                        )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Generate Button */}
                                        <Button
                                            onClick={generateCoverLetterFromCV}
                                            disabled={
                                                !cvUploadData.cvFile ||
                                                !cvUploadData.jobTitle ||
                                                !cvUploadData.company ||
                                                isGenerating
                                            }
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold"
                                        >
                                            {isGenerating ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    {isUploading
                                                        ? "Processing CV..."
                                                        : "Generating Cover Letter..."}
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles className="w-4 h-4 mr-2" />
                                                    Generate Cover Letter from CV
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Right Column - Generated Cover Letter */}
                        <Card className="bg-white">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <FileText className="w-5 h-5 mr-2" />
                                    Generated Cover Letter
                                </CardTitle>
                                <CardDescription>
                                    Your personalized cover letter will appear here
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {generatedCoverLetter ? (
                                        <>
                                            <div className="min-h-[400px]">
                                                {renderCoverLetterLayout(generatedCoverLetter)}
                                            </div>

                                            <div className="flex space-x-2">
                                                <Button
                                                    onClick={copyToClipboard}
                                                    variant="outline"
                                                    className="flex-1"
                                                >
                                                    <Copy className="w-4 h-4 mr-2" />
                                                    Copy to Clipboard
                                                </Button>
                                                <Button
                                                    onClick={downloadCoverLetter}
                                                    disabled={isDownloading}
                                                    variant="outline"
                                                    className="flex-1"
                                                >
                                                    {isDownloading ? (
                                                        <>
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                                                            Generating PDF...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Download className="w-4 h-4 mr-2" />
                                                            Download PDF
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="bg-gray-50 p-8 rounded-lg border min-h-[400px] flex items-center justify-center">
                                            <div className="text-center text-gray-400">
                                                <FileText className="w-12 h-12 mx-auto mb-4" />
                                                <p>
                                                    {activeOption === "form"
                                                        ? "Complete the form to generate your cover letter..."
                                                        : "Upload your CV and provide job details to generate your cover letter..."}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Features Section */}
                    <div className="mt-16">
                        <h2 className="text-3xl font-bold text-center mb-12">
                            Why Choose Our Cover Letter Generator?
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <Card className="text-center p-6">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Sparkles className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">AI-Powered</h3>
                                <p className="text-gray-600">
                                    Advanced AI technology creates personalized, professional cover
                                    letters tailored to your experience and the job requirements.
                                </p>
                            </Card>
                            <Card className="text-center p-6">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Target className="w-6 h-6 text-green-600" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Two Options</h3>
                                <p className="text-gray-600">
                                    Choose between CV upload for automatic extraction or our simple
                                    3-step form for manual input. Both deliver professional results.
                                </p>
                            </Card>
                            <Card className="text-center p-6">
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-6 h-6 text-purple-600" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Auto-Save</h3>
                                <p className="text-gray-600">
                                    Your progress is automatically saved, so you can return anytime
                                    to continue where you left off.
                                </p>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </ToolsLayout>
    );
}