import { GoogleGenAI } from "@google/genai";
import { ResumeData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateResumeSummary = async (data: ResumeData): Promise<string> => {
  const { jobTitle, company } = data.experience[0] || { jobTitle: 'Professional', company: 'Industry' };
  const skillsList = data.skills.map(s => s.name).join(', ');
  
  const prompt = `
    You are an expert resume writer. Write a professional, punchy, and ATS-friendly professional summary (approx 50-80 words) for a resume.
    
    Candidate Details:
    - Most Recent Role: ${jobTitle} at ${company}
    - Key Skills: ${skillsList || 'General Professional Skills'}
    - Years of Experience: ${data.experience.length * 2} (estimated)
    
    The summary should highlight leadership, problem-solving, and technical expertise relevant to their background. Do not use placeholders. Write in the first person but without pronouns (e.g., "Experienced software engineer..." instead of "I am an experienced...").
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    return response.text || "Could not generate summary.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate summary. Please check your API configuration.");
  }
};
