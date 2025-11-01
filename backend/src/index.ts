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
import mongoose, { Schema, model } from 'mongoose';

type JwtUser = { sub: string; role?: string };
function authRequired(req: express.Request, res: express.Response, next: express.NextFunction) {
  const hdr = req.headers.authorization;
  if (!hdr || !hdr.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
  try {
    const token = hdr.slice(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'devsecret') as JwtUser;
    (req as any).user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT ? Number(process.env.PORT) : 8000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
const FRONTEND_ORIGINS = process.env.FRONTEND_ORIGINS || '';
const allowedOrigins = [
  ...FRONTEND_ORIGINS.split(',').map((s) => s.trim()).filter(Boolean),
  FRONTEND_ORIGIN,
  'http://localhost:3000',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser tools or same-origin
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // Dev-friendly: allow localhost/127.0.0.1 on any port (e.g., Go Live)
    try {
      const url = new URL(origin);
      if ((url.hostname === 'localhost' || url.hostname === '127.0.0.1')) return callback(null, true);
    } catch {}
    return callback(new Error('CORS blocked for origin: ' + origin));
  },
  credentials: true,
}));
app.use(express.json());

// Health
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'swasthsaathi-backend' });
});

// -----------------------------
// Admin: set user role (demo). Requires admin JWT.
// -----------------------------
app.post('/api/admin/set-role', (req, res) => {
  const hdr = req.headers.authorization;
  if (!hdr || !hdr.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
  try {
    const decoded = jwt.verify(hdr.slice(7), process.env.JWT_SECRET || 'devsecret') as JwtUser;
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  } catch { return res.status(401).json({ error: 'Invalid token' }); }
  const { phone, role } = req.body || {};
  if (!phone || !role) return res.status(400).json({ error: 'phone and role required' });
  (async()=>{
    try{
      if (mongoose.connection.readyState === 1) {
        await UserModel.updateOne({ phone }, { $set: { role } }, { upsert: true });
      }
      res.json({ success: true });
    }catch(e){ res.status(500).json({ error: 'Failed to set role' }); }
  })();
});

// -----------------------------
// NGOs
// -----------------------------
const defaultNgos = [
  { name: 'Helping Hands', city: 'Delhi', contact: '+91-99999 11111', tags: ['wheelchair','blind'] },
  { name: 'Able India', city: 'Mumbai', contact: '+91-88888 22222', tags: ['orthopedic'] },
];
app.get('/api/ngos', async (_req, res) => {
  try {
    if (mongoose.connection.readyState === 1 && NgoModel) {
      const docs = await NgoModel.find({}).lean();
      return res.json({ ngos: docs });
    }
  } catch {}
  res.json({ ngos: defaultNgos });
});
app.post('/api/ngos/connect', async (req, res) => {
  const { name, phone } = req.body || {};
  if (!name || !phone) return res.status(400).json({ error: 'name and phone required' });
  // In real app, create a ticket; here we just echo success
  res.json({ success: true, message: `Connection request sent to ${name}` });
});

// -----------------------------
// Hospitals & Appointments
// -----------------------------
const defaultHospitals = [
  { name: 'City Care Hospital', city: 'Delhi', specialties: ['Cardio','Ortho'] },
  { name: 'Metro Health', city: 'Mumbai', specialties: ['ENT','Neuro'] },
];
app.get('/api/hospitals', async (_req, res) => {
  try {
    if (mongoose.connection.readyState === 1 && HospitalModel) {
      const docs = await HospitalModel.find({}).lean();
      return res.json({ hospitals: docs });
    }
  } catch {}
  res.json({ hospitals: defaultHospitals });
});
app.post('/api/appointments', async (req, res) => {
  const { phone, doctor, time } = req.body || {};
  if (!phone || !doctor || !time) return res.status(400).json({ error: 'phone, doctor, time required' });
  try {
    if (mongoose.connection.readyState === 1 && AppointmentModel) {
      const doc = await AppointmentModel.create({ phone, doctor, time, createdAt: new Date() });
      return res.json({ appointment: doc });
    }
  } catch {}
  // Fallback mock
  res.json({ appointment: { id: Date.now(), phone, doctor, time } });
});
app.get('/api/appointments', async (req, res) => {
  const { phone } = req.query as any;
  try {
    if (mongoose.connection.readyState === 1 && AppointmentModel) {
      const docs = await AppointmentModel.find(phone ? { phone } : {}).sort({ createdAt: -1 }).limit(200).lean();
      return res.json({ appointments: docs });
    }
  } catch {}
  res.json({ appointments: [] });
});

// -----------------------------
// Checkups
// -----------------------------
app.post('/api/checkups', async (req, res) => {
  const { phone, title, date } = req.body || {};
  if (!phone || !title || !date) return res.status(400).json({ error: 'phone, title, date required' });
  try {
    if (mongoose.connection.readyState === 1 && CheckupModel) {
      const doc = await CheckupModel.create({ phone, title, date, createdAt: new Date() });
      return res.json({ checkup: doc });
    }
  } catch {}
  res.json({ checkup: { id: Date.now(), phone, title, date } });
});
app.get('/api/checkups', async (req, res) => {
  const { phone } = req.query as any;
  try {
    if (mongoose.connection.readyState === 1 && CheckupModel) {
      const docs = await CheckupModel.find(phone ? { phone } : {}).sort({ createdAt: -1 }).limit(200).lean();
      return res.json({ checkups: docs });
    }
  } catch {}
  res.json({ checkups: [] });
});

// -----------------------------
// Community Posts
// -----------------------------
app.post('/api/posts', async (req, res) => {
  const { phone, text } = req.body || {};
  if (!phone || !text) return res.status(400).json({ error: 'phone and text required' });
  try {
    if (mongoose.connection.readyState === 1 && PostModel) {
      const doc = await PostModel.create({ phone, text, createdAt: new Date() });
      return res.json({ post: doc });
    }
  } catch {}
  res.json({ post: { id: Date.now(), phone, text } });
});
app.get('/api/posts', async (_req, res) => {
  try {
    if (mongoose.connection.readyState === 1 && PostModel) {
      const docs = await PostModel.find({}).sort({ createdAt: -1 }).limit(200).lean();
      return res.json({ posts: docs });
    }
  } catch {}
  res.json({ posts: [] });
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
app.post('/api/auth/verify', async (req, res) => {
  const parsed = OtpVerify.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid payload' });
  const { phone, code } = parsed.data;
  if (code !== '123456') return res.status(401).json({ error: 'Invalid code' });
  let role = 'user';
  try {
    if (mongoose.connection.readyState === 1) {
      const existing = await UserModel.findOneAndUpdate(
        { phone },
        { $setOnInsert: { phone, createdAt: new Date() } },
        { upsert: true, new: true }
      );
      role = existing?.role || 'user';
    }
  } catch {}
  const token = jwt.sign({ sub: phone, role }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '12h' });
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
  (async () => {
    try {
      if (mongoose.connection.readyState === 1) {
        // If user token provided, attach phone to file
        let phone: string | undefined;
        try {
          const auth = req.headers.authorization;
          if (auth?.startsWith('Bearer ')) {
            const decoded = jwt.verify(auth.slice(7), process.env.JWT_SECRET || 'devsecret') as JwtUser;
            phone = decoded.sub;
          }
        } catch {}
        await FileModel.create({ fileId: file.filename, originalName: file.originalname || '', phone, createdAt: new Date() });
      }
    } catch {}
    res.json({ id: file.filename, originalName: file.originalname });
  })();
});

app.get('/api/files', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      let phoneFilter: any = {};
      try {
        const auth = req.headers.authorization;
        if (auth?.startsWith('Bearer ')) {
          const decoded = jwt.verify(auth.slice(7), process.env.JWT_SECRET || 'devsecret') as JwtUser;
          phoneFilter = decoded?.sub ? { phone: decoded.sub } : {};
        }
      } catch {}
      const docs = await FileModel.find(phoneFilter).sort({ createdAt: -1 }).limit(200).lean();
      return res.json({ files: docs.map(d => ({ id: d.fileId, originalName: d.originalName, createdAt: d.createdAt })) });
    }
  } catch {}
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

// Optional Mongo connection
const MONGO_URI = process.env.MONGO_URI;
let FileModel: mongoose.Model<any>;
let UserModel: mongoose.Model<any>;
let NgoModel: mongoose.Model<any>;
let HospitalModel: mongoose.Model<any>;
let AppointmentModel: mongoose.Model<any>;
let CheckupModel: mongoose.Model<any>;
let PostModel: mongoose.Model<any>;
if (MONGO_URI) {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      const FileSchema = new Schema({
        fileId: { type: String, index: true },
        originalName: String,
        createdAt: Date,
      });
      const UserSchema = new Schema({
        phone: { type: String, unique: true },
        role: { type: String, default: 'user' },
        createdAt: Date,
      });
      const NgoSchema = new Schema({
        name: String,
        city: String,
        contact: String,
        tags: [String],
      });
      const HospitalSchema = new Schema({
        name: String,
        city: String,
        specialties: [String],
      });
      const AppointmentSchema = new Schema({
        phone: String,
        doctor: String,
        time: String,
        createdAt: Date,
      });
      const CheckupSchema = new Schema({
        phone: String,
        title: String,
        date: String,
        createdAt: Date,
      });
      const PostSchema = new Schema({
        phone: String,
        text: String,
        createdAt: Date,
      });
      FileModel = model('File', FileSchema);
      UserModel = model('User', UserSchema);
      NgoModel = model('Ngo', NgoSchema);
      HospitalModel = model('Hospital', HospitalSchema);
      AppointmentModel = model('Appointment', AppointmentSchema);
      CheckupModel = model('Checkup', CheckupSchema);
      PostModel = model('Post', PostSchema);
      console.log('Connected to MongoDB');
    })
    .catch((e) => console.error('Mongo connection error', e.message));
} else {
  console.log('MONGO_URI not set; running without DB persistence');
}
