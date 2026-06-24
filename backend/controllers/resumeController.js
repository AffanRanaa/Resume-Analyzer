const Resume = require('../models/Resume');
const cloudinary = require('../utils/cloudinary');
const { extractTextFromResume } = require('../utils/extractText');
const axios = require('axios');

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      console.error('Upload failed: No file in req.file');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('File received for upload:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    const fileType = req.file.mimetype.includes('pdf') ? 'pdf' : 'docx';

    // 1. EXTRACT TEXT
    let extractedText = '';
    try {
      extractedText = await extractTextFromResume(req.file.buffer, fileType);
      if (!extractedText || !extractedText.trim()) {
        throw new Error('Text extraction returned empty content. The file may be scanned or use unsupported text encoding.');
      }
    } catch (extractErr) {
      console.error('Text extraction failed for file:', req.file.originalname, extractErr);
      return res.status(500).json({ message: `Failed to extract text from the file: ${extractErr.message}` });
    }

    // 2. UPLOAD TO CLOUDINARY
    let cloudinaryUrl = '';
    let cloudinaryPublicId = '';

    try {
      const uploadResult = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
        {
          folder: 'resume-analyzer/resumes',
          resource_type: 'auto',
        }
      );
      cloudinaryUrl = uploadResult.secure_url;
      cloudinaryPublicId = uploadResult.public_id;
    } catch (uploadErr) {
      console.error('Cloudinary upload failed:', uploadErr);
      return res.status(500).json({ message: 'Failed to upload file to Cloudinary.' });
    }

    // 3. CALL GROQ
    if (!process.env.GROQ_API_KEY) {
      console.error('Missing GROQ_API_KEY in backend environment config!');
      return res.status(500).json({ message: 'Server configuration missing Groq API key.' });
    }

    let atsScore = null;
    let atsReasoning = '';
    let missingSkills = [];
    let suggestions = [];
    let analysisRaw = '';
    let analysisStatus = 'failed';

    try {
      const prompt = `
You are an expert ATS (Applicant Tracking System). Analyze the resume below and respond ONLY with valid JSON in this exact format:
{
  "atsScore": <number 0-100>,
  "atsReasoning": "<one paragraph explaining the score>",
  "missingSkills": ["skill1", "skill2"],
  "suggestions": ["suggestion1", "suggestion2"]
}

Resume Text:
${extractedText}
      `;

      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      analysisRaw = response.data.choices[0].message.content;

      const jsonMatch = analysisRaw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        atsScore = parsed.atsScore ?? null;
        atsReasoning = parsed.atsReasoning ?? '';
        missingSkills = parsed.missingSkills ?? [];
        suggestions = parsed.suggestions ?? [];
        analysisStatus = 'completed';
      }
    } catch (apiErr) {
      console.error('Groq API call failed:', apiErr.response?.data || apiErr.message);
      analysisStatus = 'failed';
    }

    // 4. SAVE TO MONGO
    const resume = await Resume.create({
      userId: req.user._id,
      originalName: req.file.originalname,
      cloudinaryUrl,
      cloudinaryPublicId,
      fileSize: req.file.size,
      fileType,
      atsScore,
      atsReasoning,
      missingSkills,
      suggestions,
      analysisStatus,
      analysisRaw,
    });

    return res.status(201).json({ resume });

  } catch (err) {
    console.error('Resume upload endpoint error:', err);
    return res.status(500).json({ message: err.message });
  }
};

exports.listResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ resumes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    res.json({ resume });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });

    if (resume.cloudinaryPublicId) {
      await cloudinary.uploader.destroy(resume.cloudinaryPublicId, { resource_type: 'raw' });
    }

    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};