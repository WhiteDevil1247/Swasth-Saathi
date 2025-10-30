import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { WebSocketServer } from 'ws';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT ? Number(process.env.PORT) : 8000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';

app.use(cors({ origin: [FRONTEND_ORIGIN, 'http://localhost:3000'], credentials: true }));
app.use(express.json());

// Health
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'swasthsaathi-backend' });
});

// Auth (mock OTP/JWT)
const OtpRequest = z.object({ phone: z.string().min(6) });
app.post('/api/auth/request-otp', (req, res) => {
  const parsed = OtpRequest.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid phone' });
  // fixed code for dev
  res.json({ success: true, code: '123456' });
});

const OtpVerify = z.object({ phone: z.string().min(6), code: z.string().min(4) });
app.post('/api/auth/verify', (req, res) => {
  const parsed = OtpVerify.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid payload' });
  const { phone, code } = parsed.data;
  if (code !== '123456') return res.status(401).json({ error: 'Invalid code' });
  const token = jwt.sign({ sub: phone, role: 'user' }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '1h' });
  res.json({ token });
});

// File storage (local)
const storageRoot = path.join(process.cwd(), 'storage');
const uploadRoot = path.join(storageRoot, 'uploads');
fs.mkdirSync(uploadRoot, { recursive: true });

const upload = multer({ dest: uploadRoot, limits: { fileSize: 10 * 1024 * 1024 } });

app.post('/api/upload', upload.single('file'), (req, res) => {
  const file = (req as any).file as { filename: string; originalname?: string } | undefined;
  if (!file) return res.status(400).json({ error: 'No file uploaded' });
  // In a real app, persist metadata in DB; for demo, list from FS
  res.json({ id: file.filename, originalName: file.originalname });
});

app.get('/api/files', (_req, res) => {
  const files = fs.readdirSync(uploadRoot).map((f) => ({ id: f }));
  res.json({ files });
});

// AI Mock
const AiRequest = z.object({ input: z.string().min(1) });
app.post('/api/ai/infer', (req, res) => {
  const parsed = AiRequest.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input' });
  const { input } = parsed.data;
  res.json({ result: `Mock analysis for: ${input}`, confidence: 0.87 });
});

// WebSocket signaling
const wss = new WebSocketServer({ server, path: '/signalling' });
wss.on('connection', (socket) => {
  socket.on('message', (data) => {
    // naive broadcast to others; in prod add rooms, auth, etc.
    wss.clients.forEach((client) => {
      if (client !== socket && (client as any).readyState === 1) {
        (client as any).send(data);
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
