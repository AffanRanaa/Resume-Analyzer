const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const { uploadResume, listResumes, getResume, deleteResume } = require('../controllers/resumeController');

// POST /api/resumes/  (multipart form field 'file')
router.post('/', protect, upload.single('file'), uploadResume);
router.get('/', protect, listResumes);
router.get('/:id', protect, getResume);
router.delete('/:id', protect, deleteResume);

module.exports = router;
