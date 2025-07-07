const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    message: 'Solvik SaaS API is running'
  });
});

// Auth endpoints (mock)
app.post('/api/auth/signup', (req, res) => {
  res.json({
    success: true,
    message: 'User created successfully',
    userId: 'mock-user-id'
  });
});

app.post('/api/auth/send-otp', (req, res) => {
  res.json({
    success: true,
    message: 'OTP sent successfully',
    userId: 'mock-user-id'
  });
});

app.post('/api/auth/verify-otp', (req, res) => {
  res.json({
    success: true,
    message: 'OTP verified successfully'
  });
});

app.post('/api/auth/signin', (req, res) => {
  res.json({
    success: true,
    token: 'mock-token',
    user: {
      id: 'mock-user-id',
      name: 'Test User',
      email: 'test@example.com',
      subdomain: 'test'
    }
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Solvik SaaS API running on port ${PORT}`);
});