import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all micro-frontends
app.use(cors({
  origin: ['http://localhost:9001', 'http://localhost:9002', 'http://localhost:9003'],
  credentials: true
}));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve src files (for the root-config.js)
app.use('/src', express.static(path.join(__dirname, 'src')));

// Single-SPA root config route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve root-config.js with correct MIME type
app.get('/src/root-config.js', (req, res) => {
  res.set('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, 'src', 'root-config.js'));
});

// Health check for container monitoring
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'single-spa-shell' 
  });
});

// Catch all route - serve index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Single-SPA Shell running on http://localhost:${PORT}`);
  console.log(`📍 Serving micro-frontends:`);
  console.log(`   🏠 Home: http://localhost:9001`);
  console.log(`   📊 Analytics: http://localhost:9002`);
  console.log(`   💳 Transactions: http://localhost:9003`);
});
