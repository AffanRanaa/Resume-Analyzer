// utils/geminiPrompts.js
const { GoogleGenAI } = require('@google/genai');

exports.analyzeAllResumeMetrics = async (resumeText) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is missing from environment variables.');
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const prompt = `
    You are an expert ATS (Applicant Tracking System) platform and HR Executive.
    Analyze the following resume text string thoroughly.
    
    You must output a single, valid JSON object matching this exact structure:
    {
      "score": <number 0-100>,
      "reasoning": "<2-3 sentence explanation>",
      "missingSkills": ["skill1", "skill2"],
      "weaknesses": ["weakness1"],
      "suggestions": ["suggestion1", "suggestion2"],
      "coverLetter": "<A professional 300-400 word cover letter tailored to this resume text>"
    }

    Resume Text Content:
    ${resumeText}
  `;

  // --- RETRY CONFIGURATION ---
  const maxRetries = 3;
  let delay = 2000; // Start with a 2-second wait

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const resp = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        },
      });

      return JSON.parse(resp.text);

    } catch (err) {
      // If it's a 503 (High Demand) or 429 (Rate Limit), wait and try again
      if ((err.status === 503 || err.status === 429) && attempt < maxRetries) {
        console.warn(`Gemini busy (Status ${err.status}). Retry attempt ${attempt} of ${maxRetries} in ${delay}ms...`);

        // Wait for the delay duration
        await new Promise(resolve => setTimeout(resolve, delay));

        // Double the waiting time for the next round (exponential backoff)
        delay *= 2;
        continue;
      }

      // If it's a different error (like a syntax issue), throw it immediately
      console.error('Gemini Single-Call Analysis error:', err.message);
      throw err;
    }
  }
};