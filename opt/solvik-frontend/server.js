// Simple Express server to serve the Next.js static build
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to handle API requests
app.use('/api', (req, res) => {
  // Redirect API requests to the backend
  const backendUrl = 'http://localhost:8000';
  const options = {
    hostname: 'localhost',
    port: 8000,
    path: req.url,
    method: req.method,
    headers: req.headers
  };

  // Forward the request to the backend
  const http = require('http');
  const backendReq = http.request(options, (backendRes) => {
    res.statusCode = backendRes.statusCode;
    
    // Copy headers from backend response
    Object.keys(backendRes.headers).forEach(key => {
      res.setHeader(key, backendRes.headers[key]);
    });
    
    // Pipe the backend response to the client
    backendRes.pipe(res);
  });
  
  // Forward the request body to the backend
  if (req.body) {
    backendReq.write(JSON.stringify(req.body));
  }
  
  backendReq.on('error', (error) => {
    console.error('Error forwarding request to backend:', error);
    res.status(500).json({ error: 'Backend service unavailable' });
  });
  
  backendReq.end();
});

// Serve static files from the Next.js build
app.use(express.static(path.join(__dirname, 'out')));

// Handle all other requests with the Next.js app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'out', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Frontend server running on port ${PORT}`);
});