// D:\Resume Analyzer\backend\controllers\analysisController.js

const Resume = require('../models/Resume');
const { extractTextFromResume } = require('../utils/extractText');
const { analyzeAllResumeMetrics } = require('../utils/groqPrompts');

exports.analyzeResume = async (req, res) => {
  let resume;
  try {
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ message: "Server misconfiguration: Groq API key is missing." });
    }

    // 2. Fetch the requested resume and verify user authorization
    resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });

    // Set fallback status to processing so user sees feedback on UI
    resume.analysisStatus = 'processing';
    await resume.save();

    // 3. Extract text strings from Cloudinary using your utility script
    const resumeText = await extractTextFromResume(resume.cloudinaryUrl, resume.fileType);

    if (!resumeText || resumeText.trim() === "") {
      throw new Error("Unable to extract readable text content from the uploaded document file.");
    }

    // 4. Fire exactly ONE unified query payload using GROQ only
    const analysisResult = await analyzeAllResumeMetrics(resumeText);

    // 5. Bind the extracted properties out of the combined parsed JSON object
    resume.atsScore = analysisResult.score ?? null;
    resume.atsReasoning = analysisResult.reasoning ?? null;
    resume.missingSkills = analysisResult.missingSkills || [];
    resume.suggestions = analysisResult.suggestions || [];
    resume.coverLetter = analysisResult.coverLetter || null;
    resume.analysisStatus = 'completed';
    await resume.save();

    // 6. Handle historical system date limits and daily tracking
    const user = req.user;
    const today = new Date().toDateString();
    const lastDate = user.lastAnalysisDate ? user.lastAnalysisDate.toDateString() : null;

    if (lastDate !== today) {
      user.analysisCountToday = 1;
    } else {
      user.analysisCountToday = (user.analysisCountToday || 0) + 1;
    }
    user.lastAnalysisDate = new Date();
    await user.save();

    // 7. Dispatch the completed schema model data package back to React
    return res.json({ resume });

  } catch (err) {
    console.error('Critical Resume Analysis Processing Failure:', err);

    // Safety fallback to let the user know the background thread crashed
    if (resume) {
      resume.analysisStatus = 'failed';
      resume.analysisError = err.message;
      await resume.save();
    }
    return res.status(500).json({ message: err.message });
  }
};