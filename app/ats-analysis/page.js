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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Target,
  BarChart3,
  Zap,
  Shield,
  TrendingUp,
  Eye,
  X,
  Loader2,
  Download,
  Copy,
  Check,
} from "lucide-react";
import ToolsLayout from "../tools-layout";

export default function ATSAnalysisPage() {
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");
  const [showComparison, setShowComparison] = useState(false);
  const [extractionResult, setExtractionResult] = useState(null);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  // Load PDF.js on component mount
  useEffect(() => {
    const loadPDFJS = async () => {
      if (typeof window !== "undefined" && !window.pdfjsLib) {
        // Load PDF.js from CDN
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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type and content
      const validationResult = validateResumeFile(selectedFile);
      if (!validationResult.isValid) {
        setError(validationResult.error || "Invalid file");
        setFile(null);
        setAnalysis(null);
        setExtractionResult(null);
        return;
      }

      setFile(selectedFile);
      setError("");
      setAnalysis(null);
      setExtractionResult(null);
    }
  };

  const validateResumeFile = (file) => {
    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return { isValid: false, error: "File size must be less than 10MB" };
    }

    // Check file type
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
      "text/plain",
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: "Please upload a PDF, DOCX, or TXT file",
      };
    }

    // For PDF files, we'll do additional content validation
    if (file.type === "application/pdf") {
      return { isValid: true }; // We'll validate content during extraction
    }

    return { isValid: true };
  };

  const validateResumeContent = (text) => {
    const lowerText = text.toLowerCase();

    // Resume/CV specific keywords and patterns
    const resumeKeywords = [
      "resume",
      "cv",
      "curriculum vitae",
      "professional summary",
      "work experience",
      "employment history",
      "education",
      "skills",
      "qualifications",
      "contact information",
      "phone",
      "email",
      "address",
      "linkedin",
      "github",
      "portfolio",
      "objective",
      "career objective",
      "professional experience",
      "work history",
      "job history",
      "academic background",
      "certifications",
      "awards",
      "achievements",
      "projects",
      "technical skills",
      "soft skills",
      "languages",
      "interests",
      "references",
    ];

    // Check for resume-specific sections
    const hasResumeSections = resumeKeywords.some((keyword) =>
      lowerText.includes(keyword)
    );

    if (!hasResumeSections) {
      return {
        isValid: false,
        error:
          "This PDF does not appear to be a resume or CV. Please upload a document containing resume content (work experience, education, skills, etc.).",
      };
    }

    // Check for common non-resume content indicators
    const nonResumeIndicators = [
      "table of contents",
      "chapter",
      "appendix",
      "bibliography",
      "references",
      "abstract",
      "introduction",
      "methodology",
      "conclusion",
      "research paper",
      "academic paper",
      "thesis",
      "dissertation",
      "book",
      "manual",
      "guide",
      "instruction",
      "tutorial",
      "lesson plan",
      "syllabus",
      "course outline",
    ];

    const hasNonResumeContent = nonResumeIndicators.some((indicator) =>
      lowerText.includes(indicator)
    );

    if (hasNonResumeContent) {
      return {
        isValid: false,
        error:
          "This PDF appears to be a document other than a resume (e.g., research paper, book, manual). Please upload a resume or CV document.",
      };
    }

    // Check minimum content length for a resume
    const wordCount = text
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    if (wordCount < 50) {
      return {
        isValid: false,
        error:
          "The document appears to be too short to be a resume. Please upload a complete resume or CV document.",
      };
    }

    return { isValid: true };
  };

  const extractTextFromPDF = async (file) => {
    try {
      // Wait for PDF.js to be loaded
      if (!window.pdfjsLib) {
        throw new Error("PDF.js is not loaded yet. Please try again.");
      }

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer })
        .promise;

      let fullText = "";

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        setProgress((pageNum / pdf.numPages) * 100);

        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();

        let pageText = "";
        textContent.items.forEach((item) => {
          pageText += item.str + " ";
        });

        fullText += `--- Page ${pageNum} ---\n${pageText.trim()}\n\n`;
      }

      return fullText;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Error extracting PDF: ${errorMessage}`);
    }
  };

  const processExtractedText = async (text, file, pageCount) => {
    // Enhanced text cleaning
    const cleanedText = text
      // Remove page markers
      .replace(/--- Page \d+ ---/g, "")
      // Remove excessive whitespace
      .replace(/\n{3,}/g, "\n\n")
      .replace(/\s{2,}/g, " ")
      // Remove common PDF artifacts
      .replace(/[^\x20-\x7E\n\t]/g, " ")
      // Clean up bullet points and lists
      .replace(/^\s*[•·▪▫◦‣⁃]\s*/gm, "• ")
      // Remove header/footer artifacts
      .replace(/^\s*\d+\s*$/gm, "")
      // Clean up email patterns
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, "")
      // Remove URL patterns
      .replace(/https?:\/\/[^\s]+/g, "")
      .trim();

    // Extract structured information
    const words = cleanedText.split(/\s+/).filter((word) => word.length > 1);
    const readableWords = words.filter((word) => /^[a-zA-Z]/.test(word));
    const readabilityScore =
      words.length > 0
        ? Math.round((readableWords.length / words.length) * 100)
        : 0;

    // AI-powered engineering analysis (if OpenAI API is available)
    let engineeringDisciplines = [];
    let engineeringKeywords = [];
    let technicalTerms = [];
    let enhancedData = {};

    if (cleanedText.length > 100) {
      try {
        const response = await fetch("/api/analyze-engineering", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: cleanedText.substring(0, 4000), // Limit to first 4000 chars
          }),
        });

        if (response.ok) {
          const analysis = await response.json();
          engineeringDisciplines = analysis.disciplines || [];
          engineeringKeywords = analysis.keywords || [];
          technicalTerms = analysis.technicalTerms || [];

          // Store enhanced analysis data
          enhancedData = {
            complexity: analysis.complexity,
            documentType: analysis.documentType,
            confidence: analysis.confidence,
            analysisSummary: analysis.analysisSummary,
          };
        }
      } catch (aiError) {
        console.log("AI analysis failed, continuing without it", aiError);
      }
    }

    // Calculate enhanced engineering score
    const baseScore =
      engineeringDisciplines.length * 10 + engineeringKeywords.length * 2;
    const complexityBonus = Math.min(pageCount * 2, 20); // Bonus for multi-page documents
    const technicalDensity = Math.min(
      (engineeringKeywords.length / words.length) * 1000,
      50
    ); // Technical term density
    const engineeringScore = Math.min(
      baseScore + complexityBonus + technicalDensity,
      100
    );

    // Generate quality assessment
    let qualityWarning;
    if (readabilityScore < 50) {
      qualityWarning =
        "Text quality is low. This may be a scanned document or contain many formatting artifacts.";
    } else if (readabilityScore < 70) {
      qualityWarning =
        "Text quality is moderate. Some formatting may be lost during extraction.";
    } else if (engineeringKeywords.length < 5) {
      qualityWarning =
        "Limited technical content detected. This may not be an engineering document.";
    }

    // Extract document structure information
    const hasTableOfContents = /table\s+of\s+contents|contents|toc/i.test(
      cleanedText
    );
    const hasReferences = /references?|bibliography|works\s+cited/i.test(
      cleanedText
    );
    const hasAbstract = /abstract|summary|executive\s+summary/i.test(
      cleanedText
    );
    const hasFigures = /figure\s+\d+|fig\.\s*\d+/i.test(cleanedText);
    const hasTables = /table\s+\d+|tab\.\s*\d+/i.test(cleanedText);

    // Add document structure to extraction method
    const structureInfo = [];
    if (hasTableOfContents) structureInfo.push("TOC");
    if (hasReferences) structureInfo.push("References");
    if (hasAbstract) structureInfo.push("Abstract");
    if (hasFigures) structureInfo.push("Figures");
    if (hasTables) structureInfo.push("Tables");

    const extractionMethod = `Enhanced PDF.js extraction${structureInfo.length > 0 ? ` (${structureInfo.join(", ")})` : ""
      }`;

    return {
      fileName: file.name,
      fileSize: file.size,
      extractedText: cleanedText,
      textLength: cleanedText.length,
      pageCount: pageCount,
      wordCount: words.length,
      readableWords: readableWords.length,
      readabilityScore: readabilityScore,
      extractionMethod: extractionMethod,
      qualityWarning: qualityWarning,
      engineeringDisciplines: engineeringDisciplines,
      engineeringKeywords: engineeringKeywords,
      technicalTerms: technicalTerms,
      engineeringScore: Math.round(engineeringScore),
      ...enhancedData, // Include enhanced analysis data
    };
  };

  const extractTextFromFile = async (file) => {
    if (file.type === "application/pdf") {
      // Use enhanced PDF extraction
      const rawText = await extractTextFromPDF(file);

      // Validate that the PDF contains resume/CV content
      const contentValidation = validateResumeContent(rawText);
      if (!contentValidation.isValid) {
        throw new Error(contentValidation.error);
      }

      // Get actual page count from the PDF
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer })
        .promise;
      const processedResult = await processExtractedText(
        rawText,
        file,
        pdf.numPages
      );
      setExtractionResult(processedResult);
      return processedResult.extractedText;
    } else if (file.type === "text/plain") {
      // For text files, use simple text reading
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result;

          // Validate that the text file contains resume/CV content
          const contentValidation = validateResumeContent(content);
          if (!contentValidation.isValid) {
            reject(new Error(contentValidation.error));
            return;
          }

          resolve(content);
        };
        reader.onerror = () => {
          reject(new Error("Failed to read file"));
        };
        reader.readAsText(file);
      });
    } else {
      // For other file types, return a placeholder
      return `Resume content from ${file.name}\n\nThis is a placeholder for the actual content extraction. In a production environment, you would use appropriate libraries to extract text from various file formats.`;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError("");

    try {
      // Extract text content from the uploaded file
      const content = await extractTextFromFile(file);

      // Call the ATS analysis API
      const response = await fetch("/api/ats-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          targetRole: targetRole.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze resume");
      }

      const analysisData = await response.json();
      setAnalysis(analysisData);
    } catch (error) {
      console.error("Analysis error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred during analysis"
      );
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case "fail":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const downloadText = () => {
    if (!extractionResult) return;

    const blob = new Blob([extractionResult.extractedText], {
      type: "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${extractionResult.fileName.replace(
      ".pdf",
      ""
    )}_extracted.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    if (!extractionResult) return;

    try {
      await navigator.clipboard.writeText(extractionResult.extractedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <ToolsLayout>
      <div className="min-h-screen bg-gray-50">


        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upload Section */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Upload className="w-5 h-5 text-blue-600" />
                    <span>Upload Resume</span>
                  </CardTitle>
                  <CardDescription>
                    Upload your resume to analyze its ATS compatibility
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label
                        htmlFor="targetRole"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Target Role (Optional)
                      </label>
                      <Input
                        id="targetRole"
                        type="text"
                        placeholder="e.g., Software Engineer, Marketing Manager"
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Adding a target role enables AI-powered role-specific
                        keyword analysis for more accurate results
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="resumeFile"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Resume File
                      </label>
                      <Input
                        id="resumeFile"
                        type="file"
                        accept=".pdf,.docx,.txt"
                        onChange={handleFileChange}
                        className="w-full"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Supported: Resume/CV files only - PDF (Enhanced), DOCX,
                        TXT (Max 10MB)
                      </p>
                    </div>

                    {error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-600">{error}</p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={!file || loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <Loader2 className="animate-spin h-4 w-4" />
                          <span>Analyzing...</span>
                        </div>
                      ) : (
                        <>
                          <Target className="w-4 h-4 mr-2" />
                          Analyze ATS Compatibility
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-2">
              {/* Progress Bar */}
              {loading && (
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                  <div className="flex items-center justify-center mb-4">
                    <Loader2 className="animate-spin h-6 w-6 text-blue-600 mr-3" />
                    <span className="text-gray-700 font-medium">
                      {file?.type === "application/pdf"
                        ? "Extracting text from PDF..."
                        : "Analyzing resume..."}
                    </span>
                  </div>
                  {file?.type === "application/pdf" && (
                    <>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <div className="text-center mt-2 text-sm text-gray-600">
                        {Math.round(progress)}% complete
                      </div>
                    </>
                  )}
                </div>
              )}

              {!analysis ? (
                <div className="space-y-6">
                  {/* Welcome Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Shield className="w-5 h-5 text-blue-600" />
                        <span>ATS Compatibility Analysis</span>
                      </CardTitle>
                      <CardDescription>
                        Optimize your resume for Applicant Tracking Systems (ATS)
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                          <h3 className="font-semibold text-gray-900">
                            AI-Powered Analysis
                          </h3>
                          <p className="text-sm text-gray-600">
                            OpenAI-driven insights
                          </p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <FileText className="w-8 h-8 text-green-600 mx-auto mb-2" />
                          <h3 className="font-semibold text-gray-900">
                            Enhanced PDF Extraction
                          </h3>
                          <p className="text-sm text-gray-600">
                            Advanced text processing
                          </p>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                          <h3 className="font-semibold text-gray-900">
                            Engineering Analysis
                          </h3>
                          <p className="text-sm text-gray-600">
                            Technical term extraction
                          </p>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                          <Zap className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                          <h3 className="font-semibold text-gray-900">
                            Industry Alignment
                          </h3>
                          <p className="text-sm text-gray-600">
                            Industry-specific terminology
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-600">
                        Upload your <strong>resume or CV</strong> to get started
                        with our AI-powered ATS analysis. Our enhanced system
                        combines advanced PDF extraction with OpenAI-powered
                        analysis to provide comprehensive insights. We extract
                        text using PDF.js, analyze engineering terms and technical
                        keywords, then perform role-specific keyword analysis
                        evaluating exact matches (100% weight),
                        synonyms/variations (80% weight), related terms (60%
                        weight), and context relevance (20-40% variable weight)
                        while optimizing keyword density and industry-specific
                        terminology alignment.{" "}
                        <strong>Only resume/CV documents are accepted.</strong>
                      </p>
                    </CardContent>
                  </Card>

                  {/* Features Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>What We Analyze</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900">
                            Enhanced Extraction
                          </h4>
                          <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-center">
                              <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                              Advanced PDF.js text extraction
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                              Engineering term analysis
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                              Technical keyword identification
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                              Document quality assessment
                            </li>
                          </ul>
                        </div>
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900">
                            ATS Analysis
                          </h4>
                          <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-center">
                              <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                              Role-specific keyword matching
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                              Industry alignment scoring
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                              Keyword density optimization
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                              Comprehensive recommendations
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Overall Score */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                        <span>ATS Compatibility Score</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-6">
                        <div className="relative">
                          <div
                            className={`w-24 h-24 rounded-full border-4 border-gray-200 flex items-center justify-center ${getScoreBgColor(
                              analysis.overallScore
                            )}`}
                          >
                            <span
                              className={`text-2xl font-bold ${getScoreColor(
                                analysis.overallScore
                              )}`}
                            >
                              {analysis.overallScore}
                            </span>
                          </div>
                          <div
                            className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500"
                            style={{
                              transform: `rotate(${analysis.overallScore * 3.6
                                }deg)`,
                            }}
                          ></div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {analysis.overallScore >= 80
                              ? "Excellent ATS Compatibility"
                              : analysis.overallScore >= 60
                                ? "Good ATS Compatibility"
                                : analysis.overallScore >= 40
                                  ? "Fair ATS Compatibility"
                                  : "Poor ATS Compatibility"}
                          </h3>
                          <p className="text-gray-600">
                            Your resume has a {analysis.parseRate}% parse rate for
                            ATS systems.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Keyword Analysis */}
                  {analysis.keywordAnalysis && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Target className="w-5 h-5 text-blue-600" />
                          <span>Advanced Keyword Analysis</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {/* Exact Matches */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                              <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                              Exact Keyword Matches (100% Weight)
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {analysis.keywordAnalysis.exactMatches.map(
                                (match, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between p-2 bg-green-50 rounded-md"
                                  >
                                    <span className="font-medium text-green-800">
                                      {match.keyword}
                                    </span>
                                    <div className="flex items-center space-x-2">
                                      <Badge
                                        variant="secondary"
                                        className="bg-green-100 text-green-800"
                                      >
                                        {match.count}x
                                      </Badge>
                                      <span className="text-sm text-green-600 font-semibold">
                                        {match.weight}%
                                      </span>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>

                          {/* Synonyms */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                              <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2" />
                              Synonyms/Variations (80% Weight)
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {analysis.keywordAnalysis.synonyms.map(
                                (synonym, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between p-2 bg-yellow-50 rounded-md"
                                  >
                                    <div>
                                      <span className="font-medium text-yellow-800">
                                        {synonym.keyword}
                                      </span>
                                      <p className="text-xs text-yellow-600">
                                        from &quot;{synonym.original}&quot;
                                      </p>
                                    </div>
                                    <span className="text-sm text-yellow-600 font-semibold">
                                      {synonym.weight}%
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>

                          {/* Related Terms */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                              <FileText className="w-4 h-4 text-blue-600 mr-2" />
                              Related Terms (60% Weight)
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {analysis.keywordAnalysis.relatedTerms.map(
                                (term, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between p-2 bg-blue-50 rounded-md"
                                  >
                                    <div>
                                      <span className="font-medium text-blue-800">
                                        {term.keyword}
                                      </span>
                                      <p className="text-xs text-blue-600">
                                        Relevance: {term.relevance}
                                      </p>
                                    </div>
                                    <span className="text-sm text-blue-600 font-semibold">
                                      {term.weight}%
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>

                          {/* Context Relevance */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                              <BarChart3 className="w-4 h-4 text-purple-600 mr-2" />
                              Context Relevance (20-40% Variable Weight)
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {analysis.keywordAnalysis.contextRelevance.map(
                                (context, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between p-2 bg-purple-50 rounded-md"
                                  >
                                    <div>
                                      <span className="font-medium text-purple-800">
                                        {context.keyword}
                                      </span>
                                      <p className="text-xs text-purple-600">
                                        Context: {context.context}
                                      </p>
                                    </div>
                                    <span className="text-sm text-purple-600 font-semibold">
                                      {context.weight}%
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>

                          {/* Keyword Density */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">
                              Keyword Density Analysis
                            </h4>
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-600">
                                  Current Density:
                                </span>
                                <span className="font-semibold text-gray-900">
                                  {
                                    analysis.keywordAnalysis.densityAnalysis
                                      .overallDensity
                                  }
                                  %
                                </span>
                              </div>
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-sm text-gray-600">
                                  Recommended:
                                </span>
                                <span className="font-semibold text-gray-900">
                                  {
                                    analysis.keywordAnalysis.densityAnalysis
                                      .recommendedDensity
                                  }
                                  %
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge
                                  variant="secondary"
                                  className={
                                    analysis.keywordAnalysis.densityAnalysis
                                      .status === "optimal"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }
                                >
                                  {analysis.keywordAnalysis.densityAnalysis.status.toUpperCase()}
                                </Badge>
                              </div>
                              <ul className="mt-3 space-y-1">
                                {analysis.keywordAnalysis.densityAnalysis.suggestions.map(
                                  (suggestion, index) => (
                                    <li
                                      key={index}
                                      className="text-sm text-gray-600 flex items-center"
                                    >
                                      <CheckCircle className="w-3 h-3 text-green-600 mr-2" />
                                      {suggestion}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          </div>

                          {/* Industry Alignment */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">
                              Industry-Specific Terminology Alignment
                            </h4>
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-sm text-gray-600">
                                  Alignment Score:
                                </span>
                                <span className="font-semibold text-gray-900">
                                  {
                                    analysis.keywordAnalysis.industryAlignment
                                      .score
                                  }
                                  /100
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h5 className="font-medium text-green-800 mb-2">
                                    Matched Terms:
                                  </h5>
                                  <div className="space-y-1">
                                    {analysis.keywordAnalysis.industryAlignment.matchedTerms.map(
                                      (term, index) => (
                                        <div
                                          key={index}
                                          className="flex items-center"
                                        >
                                          <CheckCircle className="w-3 h-3 text-green-600 mr-2" />
                                          <span className="text-sm text-gray-700">
                                            {term}
                                          </span>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>

                                <div>
                                  <h5 className="font-medium text-red-800 mb-2">
                                    Missing Terms:
                                  </h5>
                                  <div className="space-y-1">
                                    {analysis.keywordAnalysis.industryAlignment.missingTerms.map(
                                      (term, index) => (
                                        <div
                                          key={index}
                                          className="flex items-center"
                                        >
                                          <XCircle className="w-3 h-3 text-red-600 mr-2" />
                                          <span className="text-sm text-gray-700">
                                            {term}
                                          </span>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="mt-4">
                                <h5 className="font-medium text-blue-800 mb-2">
                                  Industry Suggestions:
                                </h5>
                                <ul className="space-y-1">
                                  {analysis.keywordAnalysis.industryAlignment.suggestions.map(
                                    (suggestion, index) => (
                                      <li
                                        key={index}
                                        className="text-sm text-gray-600 flex items-start"
                                      >
                                        <TrendingUp className="w-3 h-3 text-blue-600 mr-2 mt-0.5" />
                                        {suggestion}
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Detailed Analysis */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Detailed Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analysis.checks.map((check, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              {getStatusIcon(check.status)}
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {check.name}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  Score: {check.score}/100
                                </p>
                              </div>
                            </div>
                            <Badge
                              variant={
                                check.status === "pass" ? "secondary" : "outline"
                              }
                              className={
                                check.status === "pass"
                                  ? "bg-green-100 text-green-800"
                                  : check.status === "warning"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }
                            >
                              {check.status.toUpperCase()}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recommendations */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Zap className="w-5 h-5 text-blue-600" />
                        <span>Recommendations</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {analysis.recommendations.map(
                          (rec, index) => (
                            <div
                              key={index}
                              className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg"
                            >
                              <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                              <p className="text-gray-700">{rec}</p>
                            </div>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex space-x-4">
                    <Button
                      onClick={() => {
                        setAnalysis(null);
                        setFile(null);
                        setExtractionResult(null);
                      }}
                      variant="outline"
                      className="flex-1 cursor-pointer"
                    >
                      Analyze Another Resume
                    </Button>
                    <Link href="/signup" className="flex-1">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        Get Full Access
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Before/After Comparison Modal */}
        {showComparison && analysis && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full h-[95vh] flex flex-col">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Before/After Comparison
                    </h2>
                    <p className="text-sm text-gray-600">
                      See how your resume content has been optimized for ATS
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => setShowComparison(false)}
                  variant="outline"
                  size="sm"
                  className="border-gray-300"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Before (Original) */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Original Content
                      </h3>
                      <Badge
                        variant="outline"
                        className="bg-red-50 text-red-700 border-red-200"
                      >
                        Before Optimization
                      </Badge>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="text-sm text-gray-700 font-mono leading-relaxed">
                        <div className="mb-4">
                          <span className="font-semibold text-red-600">
                            [Generic Content]
                          </span>
                          <p className="mt-2 text-gray-600 italic">
                            &quot;Experienced web developer with knowledge of
                            programming languages. Worked on various projects and
                            helped improve website performance. Good at problem
                            solving and working in teams.&quot;
                          </p>
                        </div>
                        <div className="mb-4">
                          <span className="font-semibold text-red-600">
                            [Vague Skills]
                          </span>
                          <p className="mt-2 text-gray-600 italic">
                            &quot;Skills: Programming, Web Development, Problem
                            Solving, Team Work&quot;
                          </p>
                        </div>
                        <div className="mb-4">
                          <span className="font-semibold text-red-600">
                            [Generic Experience]
                          </span>
                          <p className="mt-2 text-gray-600 italic">
                            &quot;Developed websites and applications. Worked with
                            databases. Collaborated with team members on various
                            projects.&quot;
                          </p>
                        </div>
                        <div>
                          <span className="font-semibold text-red-600">
                            [Missing Details]
                          </span>
                          <p className="mt-2 text-gray-600 italic">
                            &quot;Education: Computer Science degree
                            <br />
                            No certifications or specific achievements
                            mentioned&quot;
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg">
                      <h4 className="font-semibold text-red-800 mb-2">
                        Issues Identified:
                      </h4>
                      <ul className="space-y-1 text-sm text-red-700">
                        <li className="flex items-start">
                          <XCircle className="w-3 h-3 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                          Vague descriptions without specific technologies or
                          frameworks
                        </li>
                        <li className="flex items-start">
                          <XCircle className="w-3 h-3 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                          Missing quantifiable achievements and metrics
                        </li>
                        <li className="flex items-start">
                          <XCircle className="w-3 h-3 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                          Generic skill descriptions without context
                        </li>
                        <li className="flex items-start">
                          <XCircle className="w-3 h-3 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                          Limited industry-specific keywords and terminology
                        </li>
                        <li className="flex items-start">
                          <XCircle className="w-3 h-3 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                          Poor section structure and formatting
                        </li>
                        <li className="flex items-start">
                          <XCircle className="w-3 h-3 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                          Missing certifications and professional development
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* After (Optimized) */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Optimized Content
                      </h3>
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        After Optimization
                      </Badge>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 bg-green-50">
                      <div className="text-sm text-gray-700 font-mono leading-relaxed">
                        <div className="mb-4">
                          <span className="font-semibold text-green-600">
                            [Professional Summary]
                          </span>
                          <p className="mt-2">
                            &quot;Results-driven Software Engineer with 5+ years
                            of experience developing scalable web applications
                            using{" "}
                            <span className="bg-green-200 px-1 rounded">
                              React
                            </span>
                            ,{" "}
                            <span className="bg-green-200 px-1 rounded">
                              Node.js
                            </span>
                            , and{" "}
                            <span className="bg-green-200 px-1 rounded">
                              MongoDB
                            </span>
                            . Proven track record of delivering high-quality
                            software solutions that improve user experience and
                            business outcomes.&quot;
                          </p>
                        </div>
                        <div className="mb-4">
                          <span className="font-semibold text-green-600">
                            [Technical Skills]
                          </span>
                          <p className="mt-2">
                            &quot;• Programming Languages:{" "}
                            <span className="bg-green-200 px-1 rounded">
                              JavaScript (ES6+)
                            </span>
                            ,{" "}
                            <span className="bg-green-200 px-1 rounded">
                              TypeScript
                            </span>
                            , Python, Java
                            <br />• Frontend:{" "}
                            <span className="bg-green-200 px-1 rounded">
                              React.js
                            </span>
                            ,{" "}
                            <span className="bg-green-200 px-1 rounded">
                              Next.js
                            </span>
                            , HTML5, CSS3,{" "}
                            <span className="bg-green-200 px-1 rounded">
                              Tailwind CSS
                            </span>
                            <br />• Backend:{" "}
                            <span className="bg-green-200 px-1 rounded">
                              Node.js
                            </span>
                            ,{" "}
                            <span className="bg-green-200 px-1 rounded">
                              Express.js
                            </span>
                            ,{" "}
                            <span className="bg-green-200 px-1 rounded">
                              RESTful APIs
                            </span>
                            , GraphQL
                            <br />• Databases:{" "}
                            <span className="bg-green-200 px-1 rounded">
                              MongoDB
                            </span>
                            , PostgreSQL, Redis
                            <br />• DevOps:{" "}
                            <span className="bg-green-200 px-1 rounded">
                              Docker
                            </span>
                            ,{" "}
                            <span className="bg-green-200 px-1 rounded">AWS</span>
                            ,{" "}
                            <span className="bg-green-200 px-1 rounded">
                              CI/CD
                            </span>
                            , Git, GitHub Actions&quot;
                          </p>
                        </div>
                        <div className="mb-4">
                          <span className="font-semibold text-green-600">
                            [Quantified Experience]
                          </span>
                          <p className="mt-2">
                            &quot;• Developed and maintained 5+ React-based web
                            applications, improving user engagement by{" "}
                            <span className="bg-green-200 px-1 rounded">40%</span>
                            <br />• Optimized database queries resulting in{" "}
                            <span className="bg-green-200 px-1 rounded">
                              60% faster
                            </span>{" "}
                            page load times
                            <br />• Implemented CI/CD pipelines using GitHub
                            Actions, reducing deployment time by{" "}
                            <span className="bg-green-200 px-1 rounded">70%</span>
                            &quot;
                          </p>
                        </div>
                        <div>
                          <span className="font-semibold text-green-600">
                            [Certifications]
                          </span>
                          <p className="mt-2">
                            &quot;•{" "}
                            <span className="bg-green-200 px-1 rounded">
                              AWS Certified Developer Associate
                            </span>
                            <br />•{" "}
                            <span className="bg-green-200 px-1 rounded">
                              MongoDB Certified Developer
                            </span>
                            &quot;
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">
                        Improvements Made:
                      </h4>
                      <ul className="space-y-1 text-sm text-green-700">
                        <li className="flex items-start">
                          <CheckCircle className="w-3 h-3 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          Added specific technologies: React, Node.js, MongoDB,
                          AWS, Docker
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-3 h-3 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          Included quantifiable achievements: 40% engagement, 60%
                          faster load times
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-3 h-3 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          Enhanced with industry-specific keywords and terminology
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-3 h-3 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          Improved professional summary with clear value
                          proposition
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-3 h-3 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          Added structured technical skills section with
                          categories
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-3 h-3 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          Included certifications and professional development
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-3 h-3 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          Enhanced bullet points with action verbs and measurable
                          results
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Detailed Analysis Section */}
                <div className="mt-8 space-y-6">
                  {/* Content Analysis */}
                  <div className="p-6 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Content Analysis
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-red-800 mb-3">
                          Original Content Issues
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-start space-x-2">
                            <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                Generic Descriptions
                              </p>
                              <p className="text-xs text-gray-600">
                                Vague job descriptions without specific
                                technologies or achievements
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-2">
                            <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                Missing Metrics
                              </p>
                              <p className="text-xs text-gray-600">
                                No quantifiable results or measurable impact
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-2">
                            <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                Poor Structure
                              </p>
                              <p className="text-xs text-gray-600">
                                Unclear section organization and formatting
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-green-800 mb-3">
                          Optimized Improvements
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                Specific Technologies
                              </p>
                              <p className="text-xs text-gray-600">
                                Added React, Node.js, MongoDB, AWS, Docker, etc.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                Quantified Achievements
                              </p>
                              <p className="text-xs text-gray-600">
                                40% engagement increase, 60% faster load times
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                Professional Structure
                              </p>
                              <p className="text-xs text-gray-600">
                                Clear sections with proper formatting and
                                hierarchy
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Keyword Analysis */}
                  <div className="p-6 bg-blue-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">
                      Keyword Analysis
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-white rounded-lg">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Target className="w-6 h-6 text-green-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900">
                          Exact Matches
                        </h4>
                        <p className="text-sm text-gray-600">
                          15+ technical keywords
                        </p>
                        <div className="mt-2 flex flex-wrap justify-center gap-1">
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            React
                          </span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            Node.js
                          </span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            MongoDB
                          </span>
                        </div>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg">
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <BarChart3 className="w-6 h-6 text-yellow-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900">
                          Industry Terms
                        </h4>
                        <p className="text-sm text-gray-600">
                          8+ industry-specific terms
                        </p>
                        <div className="mt-2 flex flex-wrap justify-center gap-1">
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                            Microservices
                          </span>
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                            CI/CD
                          </span>
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                            RESTful APIs
                          </span>
                        </div>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Zap className="w-6 h-6 text-purple-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900">ATS Score</h4>
                        <p className="text-sm text-gray-600">
                          Improved by 14 points
                        </p>
                        <div className="mt-2">
                          <span className="text-lg font-bold text-purple-600">
                            78 → 92
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Technical Improvements */}
                  <div className="p-6 bg-green-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-900 mb-4">
                      Technical Improvements
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">
                          Before Optimization
                        </h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li className="flex items-start">
                            <XCircle className="w-3 h-3 text-red-600 mr-2 mt-1 flex-shrink-0" />
                            Generic &quot;web development&quot; skills
                          </li>
                          <li className="flex items-start">
                            <XCircle className="w-3 h-3 text-red-600 mr-2 mt-1 flex-shrink-0" />
                            No specific technologies mentioned
                          </li>
                          <li className="flex items-start">
                            <XCircle className="w-3 h-3 text-red-600 mr-2 mt-1 flex-shrink-0" />
                            Vague project descriptions
                          </li>
                          <li className="flex items-start">
                            <XCircle className="w-3 h-3 text-red-600 mr-2 mt-1 flex-shrink-0" />
                            Missing quantifiable results
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">
                          After Optimization
                        </h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li className="flex items-start">
                            <CheckCircle className="w-3 h-3 text-green-600 mr-2 mt-1 flex-shrink-0" />
                            Specific tech stack: React, Node.js, MongoDB
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="w-3 h-3 text-green-600 mr-2 mt-1 flex-shrink-0" />
                            DevOps tools: Docker, AWS, CI/CD
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="w-3 h-3 text-green-600 mr-2 mt-1 flex-shrink-0" />
                            Quantified achievements with metrics
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="w-3 h-3 text-green-600 mr-2 mt-1 flex-shrink-0" />
                            Professional certifications included
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                <div className="flex flex-col space-y-1">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">ATS Score Improvement:</span> 78
                    → 92 (+14 points)
                  </div>
                  <div className="text-xs text-yellow-600">
                    💡 Configure OpenAI API key for personalized AI-powered
                    analysis
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button
                    onClick={() => setShowComparison(false)}
                    variant="outline"
                  >
                    Close
                  </Button>
                  <Link href="/signup">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Get Full Access
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolsLayout>
  );
}
