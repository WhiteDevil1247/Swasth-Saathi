const { useEffect, useState, useRef } = React;

// -----------------------------
// Simple Hash Router
// -----------------------------
function useHashRoute() {
  const [route, setRoute] = useState(window.location.hash.replace('#', '') || 'home');
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash.replace('#', '') || 'home');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return [route, (r) => (window.location.hash = r)];
}

// -----------------------------
// UI Elements
// -----------------------------
const Nav = () => (
  <nav className="nav">
    <div className="nav-inner">
      <a className="brand" href="#home">
        <span className="brand-dot" />
        <span className="brand-title">HealthSaathi</span>
      </a>
      <div className="nav-links">
        <a className="link" href="#general">General</a>
        <a className="link" href="#accessible">Accessibility</a>
        <a className="link" href="#healthvault">HealthVault</a>
        <a className="link" href="#qr">QR</a>
        <a className="link" href="#ai">AI</a>
        <a className="link" href="#telehealth">Telehealth</a>
        <a className="link" href="#emergency">Emergency</a>
        <a className="link" href="#navigator">Navigator</a>
        <a className="link" href="#ngo">NGOs</a>
        <a className="link" href="#hospitals">Hospitals</a>
        <a className="link" href="#checkups">Checkups</a>
        <a className="link" href="#community">Community</a>
        <a className="link" href="#auth">Auth</a>
        <a className="link" href="#admin">Admin</a>
      </div>
    </div>
  </nav>
);

const Footer = () => (
  <footer className="footer">
    <div>© {new Date().getFullYear()} HealthSaathi</div>
    <div>
      <a href="#timeline">AI Timeline</a> · <a href="#score">Health Score</a> · <a href="#qr">Emergency QR</a>
    </div>
  </footer>
);

const SectionCard = ({ title, children, footer }) => (
  <div className="card">
    <div className="card-body">
      <div className="section-title">{title}</div>
      <div>{children}</div>
      {footer}
    </div>
  </div>
);

const Pill = ({ children }) => <span className="route-pill">{children}</span>;

// -----------------------------
// Pages
// -----------------------------
const Home = () => (
  <div className="content">
    <section className="hero">
      <div className="hero-grid">
        <div className="card">
          <div className="card-body">
            <div className="badge">HealthSaathi • Inclusive, AI-powered care</div>
            <h1 className="h1">Empowering Every Ability with Smart Healthcare</h1>
            <p className="p">
              Secure HealthVault, AI Health Companion, Telehealth, Emergency SOS, NGO Hub and more. Designed for accessibility,
              privacy, and scale.
            </p>
            <div className="cta-row">
              <a href="#healthvault" className="btn btn-primary">Open HealthVault</a>
              <a href="#ai" className="btn">Try AI Companion</a>
              <a href="#telehealth" className="btn">Book Teleconsultation</a>
            </div>
            <div className="kpi">
              <div className="card item"><div className="label">Uptime</div><div className="value">99.5%</div></div>
              <div className="card item"><div className="label">Languages</div><div className="value">10+</div></div>
              <div className="card item"><div className="label">Security</div><div className="value">AES-256</div></div>
              <div className="card item"><div className="label">Users</div><div className="value">1M+</div></div>
            </div>
          </div>
        </div>
        <div className="grid">
          {[
            { tag: 'HealthVault', href: '#healthvault', desc: 'Encrypted health locker with sharing & audit.' },
            { tag: 'AI Companion', href: '#ai', desc: 'Report analysis & personalized insights.' },
            { tag: 'Navigator', href: '#navigator', desc: 'Accessible hospitals & specialists nearby.' },
            { tag: 'Telehealth', href: '#telehealth', desc: 'Video consultations & e-prescriptions.' },
            { tag: 'Emergency', href: '#emergency', desc: 'SOS, live location & medical profile.' },
            { tag: 'NGO Hub', href: '#ngo', desc: 'Programs, support & rehabilitation.' },
          ].map((f) => (
            <a key={f.tag} href={f.href} className="card feature">
              <div className="feature-title">Feature</div>
              <div className="feature-name">{f.tag}</div>
              <p className="feature-desc">{f.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </section>

    <section className="section">
      <SectionCard title="What’s inside">
        <div className="routes">
          {['timeline','score','voice-gesture','audio','sign-language','qr','geo-alerts','schemes','admin'].map(r => (
            <Pill key={r}>{r}</Pill>
          ))}
        </div>
      </SectionCard>
    </section>
  </div>
);

const HealthVault = () => {
  const API_BASE = window.HEALTHSAATHI_CONFIG?.API_BASE || '';
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const listFiles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('hs_token');
      const res = await fetch(`${API_BASE}/api/files`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      const data = await res.json();
      setFiles(data.files || []);
    } catch (e) {
      console.error(e);
      alert('Failed to list files');
    } finally {
      setLoading(false);
    }
  };

// -----------------------------
// General and Accessibility Overviews
// -----------------------------
const GeneralOverview = () => (
  <div className="section">
    <SectionCard title="General Users">
      <p className="p">Centralize health data with QR access, connect with NGOs, find hospitals and doctors, and track regular checkups.</p>
      <div className="cta-row">
        <a className="btn btn-primary" href="#qr">Your QR</a>
        <a className="btn" href="#ngo">Find NGOs</a>
        <a className="btn" href="#hospitals">Hospitals & Doctors</a>
        <a className="btn" href="#checkups">Regular Checkups</a>
      </div>
    </SectionCard>
  </div>
);

const AccessibilityOverview = () => (
  <div className="section">
    <SectionCard title="Accessibility (Physically Disabled)">
      <p className="p">Smart navigation with Google Maps and geotagging, digital health records via QR, NGO connections, and a community space.</p>
      <div className="cta-row">
        <a className="btn btn-primary" href="#navigator">Smart Navigation</a>
        <a className="btn" href="#qr">Digital Records (QR)</a>
        <a className="btn" href="#ngo">NGO Support</a>
        <a className="btn" href="#community">Community Space</a>
      </div>
    </SectionCard>
  </div>
);

// -----------------------------
// NGOs list/connect
// -----------------------------
const NGOList = () => {
  const API_BASE = window.HEALTHSAATHI_CONFIG?.API_BASE || '';
  const [ngos, setNgos] = useState([]);
  const [phone, setPhone] = useState(localStorage.getItem('hs_phone') || '');
  const [status, setStatus] = useState('');
  useEffect(()=>{ (async()=>{ try{ const r=await fetch(`${API_BASE}/api/ngos`); const d=await r.json(); setNgos(d.ngos||[]);}catch(e){console.error(e);} })(); },[]);
  const connect = async(name)=>{
    try{
      setStatus('');
      const r = await fetch(`${API_BASE}/api/ngos/connect`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,phone})});
      const d = await r.json();
      if(r.ok){ setStatus(d.message||'Request sent'); localStorage.setItem('hs_phone', phone);} else alert(d.error||'Failed');
    }catch(e){ console.error(e); alert('Error'); }
  };
  return (
    <div>
      <div className="cta-row">
        <input className="btn" placeholder="Your phone" value={phone} onChange={(e)=>setPhone(e.target.value)} />
      </div>
      {status && <div style={{marginTop:10}} className="badge">{status}</div>}
      <div className="grid" style={{marginTop:12}}>
        {ngos.map((n)=> (
          <div key={n.name} className="card feature">
            <div className="feature-name">{n.name}</div>
            <p className="feature-desc">{n.city} · {n.contact}</p>
            <div className="cta-row">
              <button className="btn btn-primary" onClick={()=>connect(n.name)}>Connect</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// -----------------------------
// QR Generator
// -----------------------------
const QRGenerator = () => {
  const canvasRef = useRef(null);
  const [form, setForm] = useState({ name:'', phone:'', blood:'', allergies:'' });
  const update = (k)=>(e)=> setForm({...form, [k]: e.target.value});
  const generate = ()=>{
    const payload = { ...form, v:1 };
    const qr = new QRious({ element: canvasRef.current, value: JSON.stringify(payload), size: 220, level: 'M', background: 'transparent', foreground: '#7ee9ff' });
    qr.set({ value: JSON.stringify(payload) });
  };
  return (
    <div>
      <div className="cta-row">
        <input className="btn" placeholder="Name" value={form.name} onChange={update('name')} />
        <input className="btn" placeholder="Phone" value={form.phone} onChange={update('phone')} />
        <input className="btn" placeholder="Blood Group" value={form.blood} onChange={update('blood')} />
        <input className="btn" placeholder="Allergies" value={form.allergies} onChange={update('allergies')} />
        <button className="btn btn-primary" onClick={generate}>Generate</button>
      </div>
      <div style={{marginTop:12}} className="card"><div className="card-body" style={{display:'flex',alignItems:'center',gap:16}}>
        <canvas ref={canvasRef} width="220" height="220" />
        <div>
          <div className="feature-title">Scan to view emergency profile</div>
          <div className="feature-desc">Keep a screenshot or printout for offline access.</div>
        </div>
      </div></div>
    </div>
  );
};

// -----------------------------
// Hospitals & Appointments
// -----------------------------
const Hospitals = () => {
  const API_BASE = window.HEALTHSAATHI_CONFIG?.API_BASE || '';
  const [hospitals, setHospitals] = useState([]);
  const [doctor, setDoctor] = useState('Dr. Demo');
  const [time, setTime] = useState('2025-11-01 10:00');
  const [phone, setPhone] = useState(localStorage.getItem('hs_phone') || '');
  const [appts, setAppts] = useState([]);
  const load = async()=>{
    try{ const rh=await fetch(`${API_BASE}/api/hospitals`); const dh=await rh.json(); setHospitals(dh.hospitals||[]); }catch(e){console.error(e)}
    try{ const ra=await fetch(`${API_BASE}/api/appointments?phone=${encodeURIComponent(phone)}`); const da=await ra.json(); setAppts(da.appointments||[]);}catch(e){console.error(e)}
  };
  useEffect(()=>{ load(); },[]);
  const book = async()=>{
    try{
      const r = await fetch(`${API_BASE}/api/appointments`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone,doctor,time})});
      const d = await r.json();
      if(r.ok){ localStorage.setItem('hs_phone', phone); setAppts([d.appointment, ...appts]); alert('Booked'); } else alert(d.error||'Failed');
    }catch(e){ console.error(e); alert('Error'); }
  };
  return (
    <div className="section">
      <SectionCard title="Hospitals & Doctors">
        <div className="grid">
          {hospitals.map((h)=>(
            <div key={h.name} className="card feature">
              <div className="feature-name">{h.name}</div>
              <p className="feature-desc">{h.city} · {Array.isArray(h.specialties)?h.specialties.join(', '):''}</p>
            </div>
          ))}
        </div>
        <div className="cta-row" style={{marginTop:12}}>
          <input className="btn" placeholder="Your phone" value={phone} onChange={(e)=>setPhone(e.target.value)} />
          <input className="btn" placeholder="Doctor" value={doctor} onChange={(e)=>setDoctor(e.target.value)} />
          <input className="btn" placeholder="Time" value={time} onChange={(e)=>setTime(e.target.value)} />
          <button className="btn btn-primary" onClick={book}>Book Appointment</button>
        </div>
        <div style={{marginTop:12}} className="feature-title">Your Appointments</div>
        <div className="grid">
          {appts.map((a,idx)=>(
            <div key={a._id||a.id||idx} className="card feature">
              <div className="feature-name">{a.doctor}</div>
              <p className="feature-desc">{a.time}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
};

// -----------------------------
// Checkups
// -----------------------------
const Checkups = () => {
  const API_BASE = window.HEALTHSAATHI_CONFIG?.API_BASE || '';
  const [phone, setPhone] = useState(localStorage.getItem('hs_phone') || '');
  const [title, setTitle] = useState('General Checkup');
  const [date, setDate] = useState('2025-11-10');
  const [items, setItems] = useState([]);
  const load = async()=>{
    try{ const r=await fetch(`${API_BASE}/api/checkups?phone=${encodeURIComponent(phone)}`); const d=await r.json(); setItems(d.checkups||[]);}catch(e){console.error(e)}
  };
  useEffect(()=>{ load(); },[]);
  const add = async()=>{
    try{
      const r = await fetch(`${API_BASE}/api/checkups`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone,title,date})});
      const d = await r.json();
      if(r.ok){ localStorage.setItem('hs_phone', phone); setItems([d.checkup, ...items]); } else alert(d.error||'Failed');
    }catch(e){ console.error(e); alert('Error'); }
  };
  return (
    <div className="section">
      <SectionCard title="Regular Checkups">
        <div className="cta-row">
          <input className="btn" placeholder="Your phone" value={phone} onChange={(e)=>setPhone(e.target.value)} />
          <input className="btn" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} />
          <input className="btn" placeholder="Date" value={date} onChange={(e)=>setDate(e.target.value)} />
          <button className="btn btn-primary" onClick={add}>Add</button>
        </div>
        <div className="grid" style={{marginTop:12}}>
          {items.map((c,idx)=>(
            <div key={c._id||idx} className="card feature">
              <div className="feature-name">{c.title}</div>
              <p className="feature-desc">{c.date}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
};

// -----------------------------
// Community
// -----------------------------
const Community = () => {
  const API_BASE = window.HEALTHSAATHI_CONFIG?.API_BASE || '';
  const [phone, setPhone] = useState(localStorage.getItem('hs_phone') || '');
  const [text, setText] = useState('Hello community!');
  const [posts, setPosts] = useState([]);
  const load = async()=>{ try{ const r=await fetch(`${API_BASE}/api/posts`); const d=await r.json(); setPosts(d.posts||[]) }catch(e){console.error(e)} };
  useEffect(()=>{ load(); },[]);
  const send = async()=>{
    try{
      const r = await fetch(`${API_BASE}/api/posts`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone,text})});
      const d = await r.json();
      if(r.ok){ localStorage.setItem('hs_phone', phone); setPosts([d.post, ...posts]); setText(''); } else alert(d.error||'Failed');
    }catch(e){ console.error(e); alert('Error'); }
  };
  return (
    <div className="section">
      <SectionCard title="Community Space">
        <div className="cta-row">
          <input className="btn" placeholder="Your phone" value={phone} onChange={(e)=>setPhone(e.target.value)} />
          <input className="btn" style={{minWidth:300}} placeholder="Write a message" value={text} onChange={(e)=>setText(e.target.value)} />
          <button className="btn btn-primary" onClick={send}>Post</button>
        </div>
        <div className="grid" style={{marginTop:12}}>
          {posts.map((p,idx)=>(
            <div key={p._id||idx} className="card feature">
              <div className="feature-title">{p.phone||'anon'}</div>
              <div className="feature-name">{p.text}</div>
              <p className="feature-desc">{p.createdAt||''}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
};
  useEffect(() => { listFiles(); }, []);

  const uploadFile = async () => {
    const file = inputRef.current?.files?.[0];
    if (!file) return alert('Choose a file first');
    const fd = new FormData();
    fd.append('file', file);
    try {
      setLoading(true);
      const token = localStorage.getItem('hs_token');
      const res = await fetch(`${API_BASE}/api/upload`, { method: 'POST', headers: token ? { Authorization: `Bearer ${token}` } : {}, body: fd });
      if (!res.ok) throw new Error('Upload failed');
      await res.json();
      await listFiles();
      inputRef.current.value = '';
      alert('Uploaded');
    } catch (e) {
      console.error(e);
      alert('Upload error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <SectionCard title="HealthVault Locker">
        <p className="p">Securely store, manage, and share medical records with blockchain-backed integrity.</p>
        <div className="cta-row">
          <input type="file" ref={inputRef} />
          <button className="btn btn-primary" onClick={uploadFile} disabled={loading}>Upload Report</button>
          <button className="btn" onClick={listFiles} disabled={loading}>Refresh</button>
        </div>
        <div style={{ marginTop: 12 }}>
          <div className="feature-title">Files</div>
          <div className="grid">
            {(files||[]).map((f) => (
              <div key={f.id} className="card feature">
                <div className="feature-name">{f.id}</div>
                <p className="feature-desc">Stored in backend uploads</p>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>
    </div>
  );
};

const AICompanion = () => {
  const API_BASE = window.HEALTHSAATHI_CONFIG?.API_BASE || '';
  const [input, setInput] = useState('Hemoglobin 11.5 g/dL, RBC 4.2M');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const analyze = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/ai/infer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input })
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
      alert('AI request failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="section">
      <SectionCard title="AI Health Companion">
        <p className="p">Analyze reports, extract metrics, and generate personalized recommendations.</p>
        <div className="cta-row">
          <input style={{minWidth:280}} className="btn" value={input} onChange={(e)=>setInput(e.target.value)} />
          <button className="btn btn-primary" onClick={analyze} disabled={loading}>Analyze</button>
          <a className="btn" href="#timeline">View AI Health Timeline</a>
        </div>
        {result && (
          <div style={{marginTop:12}} className="card">
            <div className="card-body">
              <div className="feature-title">Result</div>
              <div className="feature-name">{result.result}</div>
              <p className="feature-desc">Confidence: {Math.round((result.confidence||0)*100)}%</p>
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  );
};

function loadGoogleMaps(apiKey){
  if (window.google && window.google.maps) return Promise.resolve();
  return new Promise((resolve, reject)=>{
    const s = document.createElement('script');
    s.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    s.async = true;
    s.onload = ()=>resolve();
    s.onerror = ()=>reject(new Error('Failed to load Google Maps'));
    document.head.appendChild(s);
  });
}

const Navigator = () => {
  const API_KEY = window.HEALTHSAATHI_CONFIG?.GOOGLE_MAPS_API_KEY;
  const mapRef = useRef(null);
  const [status, setStatus] = useState('Idle');

  const initMapAt = async (pos) => {
    if (!API_KEY) { alert('Set GOOGLE_MAPS_API_KEY in frontend/config.js'); return; }
    try {
      setStatus('Loading Maps...');
      await loadGoogleMaps(API_KEY);
      setStatus('Rendering map');
      const map = new google.maps.Map(mapRef.current, { center: pos, zoom: 14, mapId: 'DEMO_MAP' });
      new google.maps.Marker({ position: pos, map, title: 'You are here' });
      setStatus('Map ready');
    } catch (e) {
      console.error(e);
      alert('Map failed to load');
      setStatus('Error');
    }
  };

  const enableLocation = () => {
    if (!navigator.geolocation) return alert('Geolocation not supported');
    setStatus('Getting location...');
    navigator.geolocation.getCurrentPosition(
      (p)=>{
        const pos = { lat: p.coords.latitude, lng: p.coords.longitude };
        initMapAt(pos);
      },
      ()=>{ setStatus('Location denied'); alert('Location permission denied'); }
    );
  };

  return (
    <div className="section">
      <SectionCard title="Hospital Navigator">
        <p className="p">Find accessible hospitals and specialists using your location.</p>
        <div className="cta-row">
          <button className="btn btn-primary" onClick={enableLocation}>Enable Location</button>
          <button className="btn" onClick={()=>initMapAt({lat:28.6139,lng:77.2090})}>Open Map (Delhi)</button>
        </div>
        <div style={{marginTop:12}} className="feature-title">Status: {status}</div>
        <div ref={mapRef} style={{height:400, borderRadius:12, border:'1px solid rgba(255,255,255,.18)'}} className="card" />
      </SectionCard>
    </div>
  );
};

const Telehealth = () => {
  const API_BASE = window.HEALTHSAATHI_CONFIG?.API_BASE || '';
  const [room, setRoom] = useState('demo-room');
  const [status, setStatus] = useState('Idle');
  const localRef = useRef(null);
  const remoteRef = useRef(null);
  const pcRef = useRef(null);
  const wsRef = useRef(null);
  const [joined, setJoined] = useState(false);

  const wsUrl = API_BASE.replace('https://', 'wss://').replace('http://', 'ws://') + '/signalling';

  const createPeer = () => {
    const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
    pc.onicecandidate = (e) => {
      if (e.candidate && wsRef.current) wsRef.current.send(JSON.stringify({ type: 'ice', room, candidate: e.candidate }));
    };
    pc.ontrack = (e) => {
      if (remoteRef.current) remoteRef.current.srcObject = e.streams[0];
    };
    return pc;
  };

  const join = async () => {
    try {
      setStatus('Requesting media...');
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (localRef.current) localRef.current.srcObject = stream;

      setStatus('Connecting signalling...');
      wsRef.current = new WebSocket(wsUrl);
      await new Promise((res) => wsRef.current.addEventListener('open', res, { once: true }));

      pcRef.current = createPeer();
      stream.getTracks().forEach((t) => pcRef.current.addTrack(t, stream));

      wsRef.current.onmessage = async (msg) => {
        try {
          const data = JSON.parse(msg.data);
          if (data.room !== room) return; // simple room filter
          if (data.type === 'offer') {
            setStatus('Received offer');
            await pcRef.current.setRemoteDescription(new RTCSessionDescription(data.offer));
            const ans = await pcRef.current.createAnswer();
            await pcRef.current.setLocalDescription(ans);
            wsRef.current.send(JSON.stringify({ type: 'answer', room, answer: ans }));
          } else if (data.type === 'answer') {
            setStatus('Connected: answer received');
            await pcRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
          } else if (data.type === 'ice' && data.candidate) {
            try { await pcRef.current.addIceCandidate(new RTCIceCandidate(data.candidate)); } catch {}
          }
        } catch {}
      };

      setJoined(true);
      setStatus('Joined');
    } catch (e) {
      console.error(e);
      alert('Failed to start media');
    }
  };

  const call = async () => {
    if (!pcRef.current || !wsRef.current) return alert('Join first');
    setStatus('Creating offer...');
    const offer = await pcRef.current.createOffer();
    await pcRef.current.setLocalDescription(offer);
    wsRef.current.send(JSON.stringify({ type: 'offer', room, offer }));
    setStatus('Offer sent');
  };

  const leave = () => {
    setJoined(false);
    setStatus('Idle');
    try { pcRef.current?.getSenders()?.forEach((s)=>s.track?.stop()); } catch {}
    try { pcRef.current?.close(); } catch {}
    pcRef.current = null;
    try { wsRef.current?.close(); } catch {}
    wsRef.current = null;
    if (localRef.current) localRef.current.srcObject = null;
    if (remoteRef.current) remoteRef.current.srcObject = null;
  };

  return (
    <div className="section">
      <SectionCard title="Teleconsultation">
        <p className="p">Secure, peer-to-peer video consultation using WebRTC. Use the same room id on both ends.</p>
        <div className="cta-row">
          <input className="btn" placeholder="Room ID" value={room} onChange={(e)=>setRoom(e.target.value)} />
          {!joined ? (
            <>
              <button className="btn btn-primary" onClick={join}>Join</button>
            </>
          ) : (
            <>
              <button className="btn btn-primary" onClick={call}>Start Call</button>
              <button className="btn" onClick={leave}>Leave</button>
            </>
          )}
        </div>
        <div style={{marginTop:12}} className="feature-title">Status: {status}</div>
        <div className="grid" style={{marginTop:12}}>
          <div className="card feature">
            <div className="feature-title">Local</div>
            <video ref={localRef} autoPlay playsInline muted style={{width:'100%',borderRadius:12}} />
          </div>
          <div className="card feature">
            <div className="feature-title">Remote</div>
            <video ref={remoteRef} autoPlay playsInline style={{width:'100%',borderRadius:12}} />
          </div>
        </div>
      </SectionCard>
    </div>
  );
};

const Emergency = () => (
  <div className="section">
    <SectionCard title="Emergency Mode">
      <p className="p">Trigger SOS with live location and share your medical summary.</p>
      <div className="cta-row">
        <a className="btn btn-primary" href="#qr">Get Emergency QR</a>
        <a className="btn" href="#">Send SOS (Demo)</a>
      </div>
    </SectionCard>
  </div>
);

const NGO = () => (
  <div className="section">
    <SectionCard title="NGO & Support Hub">
      <p className="p">Discover NGOs, rehabilitation programs, and community resources.</p>
      <NGOList />
    </SectionCard>
  </div>
);

const Timeline = () => (
  <div className="section">
    <SectionCard title="AI Health Timeline">
      <p className="p">AI-generated visual history of reports and treatments.</p>
    </SectionCard>
  </div>
);

const Score = () => (
  <div className="section">
    <SectionCard title="Personalized Health Score">
      <p className="p">Your wellness index tracking lifestyle and improvement.</p>
    </SectionCard>
  </div>
);

const VoiceGesture = () => (
  <div className="section">
    <SectionCard title="Voice & Gesture Navigation">
      <p className="p">Hands-free controls for accessible navigation.</p>
    </SectionCard>
  </div>
);

const AudioReports = () => (
  <div className="section">
    <SectionCard title="Audio Health Reports">
      <p className="p">Convert reports into clear audio explanations.</p>
    </SectionCard>
  </div>
);

const SignLanguage = () => (
  <div className="section">
    <SectionCard title="Sign-Language Video Calls">
      <p className="p">AI-assisted sign-language communication during calls.</p>
    </SectionCard>
  </div>
);

const QR = () => (
  <div className="section">
    <SectionCard title="Offline Emergency QR Card">
      <p className="p">Generate a QR that encodes your emergency profile (name, phone, blood group, allergies). Store it offline.</p>
      <QRGenerator />
    </SectionCard>
  </div>
);

const GeoAlerts = () => (
  <div className="section">
    <SectionCard title="Geo-Health Alerts">
      <p className="p">Real-time disease and pollution alerts based on your location.</p>
    </SectionCard>
  </div>
);

const Schemes = () => (
  <div className="section">
    <SectionCard title="Health Scheme Auto-Matcher">
      <p className="p">AI suggests relevant government and NGO schemes.</p>
    </SectionCard>
  </div>
);

const Admin = () => (
  <div className="section">
    <SectionCard title="Admin Panel">
      <p className="p">Manage hospitals, NGOs, users, and platform configuration.</p>
    </SectionCard>
  </div>
);

// -----------------------------
// Auth Page (OTP -> JWT)
// -----------------------------
const Auth = () => {
  const API_BASE = window.HEALTHSAATHI_CONFIG?.API_BASE || '';
  const [phone, setPhone] = useState('9999999999');
  const [code, setCode] = useState('');
  const [token, setToken] = useState(localStorage.getItem('hs_token') || '');
  const [info, setInfo] = useState('');

  const requestOtp = async () => {
    setInfo('');
    const res = await fetch(`${API_BASE}/api/auth/request-otp`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ phone }) });
    const data = await res.json();
    if (res.ok) setInfo(`OTP sent (demo code: ${data.code})`); else alert(data.error||'OTP failed');
  };
  const verifyOtp = async () => {
    const res = await fetch(`${API_BASE}/api/auth/verify`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ phone, code }) });
    const data = await res.json();
    if (res.ok) { setToken(data.token); localStorage.setItem('hs_token', data.token); } else alert(data.error||'Verify failed');
  };
  const logout = () => { localStorage.removeItem('hs_token'); setToken(''); };

  return (
    <div className="section">
      <SectionCard title="Account Management (OTP Demo)">
        <div className="cta-row">
          <input className="btn" style={{minWidth:200}} placeholder="Phone" value={phone} onChange={(e)=>setPhone(e.target.value)} />
          <button className="btn btn-primary" onClick={requestOtp}>Request OTP</button>
          <input className="btn" style={{minWidth:120}} placeholder="Code" value={code} onChange={(e)=>setCode(e.target.value)} />
          <button className="btn" onClick={verifyOtp}>Verify</button>
          {token ? <button className="btn" onClick={logout}>Logout</button> : null}
        </div>
        {info && <div style={{marginTop:10}} className="badge">{info}</div>}
        {token && <div style={{marginTop:10}} className="card"><div className="card-body"><div className="feature-title">JWT</div><div className="feature-desc" style={{wordBreak:'break-all'}}>{token}</div></div></div>}
      </SectionCard>
    </div>
  );
};

// -----------------------------
// App
// -----------------------------
function App() {
  const [route] = useHashRoute();
  useEffect(() => {
    const glow = document.getElementById('cursor-glow');
    const follow = document.getElementById('cursor-follow');
    const onMove = (e) => {
      if (glow) {
        glow.style.top = e.clientY + 'px';
        glow.style.left = e.clientX + 'px';
      }
      if (follow) {
        follow.style.top = e.clientY + 'px';
        follow.style.left = e.clientX + 'px';
      }
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const Page = {
    home: Home,
    general: GeneralOverview,
    accessible: AccessibilityOverview,
    healthvault: HealthVault,
    ai: AICompanion,
    navigator: Navigator,
    telehealth: Telehealth,
    emergency: Emergency,
    ngo: NGO,
    hospitals: Hospitals,
    checkups: Checkups,
    community: Community,
    timeline: Timeline,
    score: Score,
    'voice-gesture': VoiceGesture,
    audio: AudioReports,
    'sign-language': SignLanguage,
    qr: QR,
    'geo-alerts': GeoAlerts,
    schemes: Schemes,
    admin: Admin,
    auth: Auth,
  }[route] || Home;

  return (
    <>
      <Nav />
      <Page />
      <Footer />
      <div className="toast">You are viewing: #{route}</div>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
