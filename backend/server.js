  const path = require('path');
  const dotenv = require('dotenv');
  dotenv.config({ path: path.resolve(__dirname, '.env') });

  const express = require('express');
  const mongoose = require('mongoose');
  const cors = require('cors');
  const morgan = require('morgan');
  const passport = require('./config/passport');

  const authRoutes = require('./routes/auth');
  const resumeRoutes = require('./routes/resumes');
  const analyzeRoutes = require('./routes/analyze');
  //const paymentRoutes = require('./routes/payment');
  //const { handleWebhook } = require('./controllers/paymentController');

  const app = express();

  // Stripe webhook — must be before express.json()
  //app.post('/api/webhook', express.raw({ type: 'application/json' }), handleWebhook);

  app.use(express.json());
  app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
  app.use(morgan('dev'));
  app.use(passport.initialize());

  app.use('/api/auth', authRoutes);
  app.use('/api/resumes', resumeRoutes);
  app.use('/api/analyze', analyzeRoutes);
  //app.use('/api/payment', paymentRoutes);

  app.get('/', (req, res) => {
    res.json({ message: 'Resume Analyzer API is running' });
  });

  app.use((err, req, res, next) => {
    console.error('Server error:', err.message);
    if (err.name === 'MulterError') {
      return res.status(400).json({ message: `Upload error: ${err.message}` });
    }
    res.status(500).json({ message: err.message || 'Internal server error' });
  });

  const PORT = process.env.PORT || 5000;

  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log('MongoDB connected');
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((error) => {
      console.error('MongoDB connection error:', error.message);
      process.exit(1);
    });