console.log('protect:', require('../middleware/authMiddleware'));
console.log('planMiddleware:', require('../middleware/planMiddleware'));
console.log('analyzeResume:', require('../controllers/analysisController').analyzeResume);
const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const planMiddleware = require('../middleware/planMiddleware');
const { analyzeResume } = require('../controllers/analysisController');

router.post('/:id', protect, planMiddleware, analyzeResume);

module.exports = router;
