// Limits free users to 3 analyses per day; premium bypasses limit
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const user = req.user;
  if (!user) return res.status(401).json({ message: 'Not authorized' });
  if (user.plan === 'premium') return next();

  const today = new Date().toDateString();
  const lastDate = user.lastAnalysisDate ? user.lastAnalysisDate.toDateString() : null;

  if (lastDate !== today) {
    user.analysisCountToday = 0;
    user.lastAnalysisDate = new Date();
    await user.save();
  }

  if ((user.analysisCountToday || 0) >= 3) {
    return res.status(403).json({ message: 'Daily limit reached. Upgrade to Premium.' });
  }

  next();
};
