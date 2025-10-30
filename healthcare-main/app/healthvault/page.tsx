"use client";
import React, { useEffect, useState } from "react";

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export default function HealthVaultPage() {
  const [files, setFiles] = useState<{ id: string; originalName?: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setError(null);
    try {
      const res = await fetch(`${apiBase}/files`);
      const data = await res.json();
      setFiles(data.files || []);
    } catch (e: any) {
      setError("Failed to load files");
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const body = new FormData();
    body.append("file", file);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiBase}/upload`, { method: "POST", body });
      if (!res.ok) throw new Error("upload failed");
      await refresh();
    } catch (err: any) {
      setError("Upload failed");
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="sub-container">
      <h1 className="header">HealthVault</h1>
      <div className="mt-6">
        <label className="text-14-medium mr-3" htmlFor="hv-file">Upload file</label>
        <input id="hv-file" aria-label="Upload file" type="file" onChange={onUpload} disabled={loading} />
      </div>
      {error && <p className="text-red-400 mt-4">{error}</p>}
      <div className="mt-6">
        <button className="shad-gray-btn px-4 py-2 rounded" onClick={refresh} disabled={loading}>Refresh</button>
      </div>
      <ul className="mt-6 space-y-2">
        {files.map((f) => (
          <li key={f.id} className="border border-dark-400 p-3 rounded">{f.originalName || f.id}</li>
        ))}
      </ul>
    </div>
  );
}
