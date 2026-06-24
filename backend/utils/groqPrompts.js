// utils/groqPrompts.js
const axios = require('axios');

exports.analyzeAllResumeMetrics = async (resumeText) => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is missing from environment variables.');
  }

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
  let delay = 2000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          response_format: {
            type: 'json_object'
          },
          temperature: 0.3
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const responseText = response.data.choices[0].message.content;
      return JSON.parse(responseText);

    } catch (err) {
      const status = err.response?.status;
      if ((status === 503 || status === 429) && attempt < maxRetries) {
        console.warn(`Groq busy (Status ${status}). Retry attempt ${attempt} of ${maxRetries} in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
        continue;
      }

      console.error('Groq Single-Call Analysis error:', err.response?.data || err.message);
      throw err;
    }
  }
};
