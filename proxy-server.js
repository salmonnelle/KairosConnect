const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = 3002;

// Enable CORS for all routes
app.use(cors());

// Create proxy for Supabase API
app.use('/supabase-proxy', createProxyMiddleware({
  target: 'https://dcafwtbvminkdcwurdrl.supabase.co',
  changeOrigin: true,
  pathRewrite: {
    '^/supabase-proxy': ''
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying request to: ${req.originalUrl}`);
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).send('Proxy error: ' + err.message);
  }
}));

app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});
