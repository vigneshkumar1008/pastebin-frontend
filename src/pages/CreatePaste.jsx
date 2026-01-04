import { useState } from "react";
import { API_BASE } from "../config";

export default function CreatePaste() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [views, setViews] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setResultUrl("");

    if (!content.trim()) {
      setError("Paste content is required");
      return;
    }

    const body = { content };
    if (ttl) body.ttl_seconds = Number(ttl);
    if (views) body.max_views = Number(views);

    try {
      const res = await fetch(`${API_BASE}/pastes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create paste");
      }

      const data = await res.json();
      setResultUrl(data.url);
      setContent("");
      setTtl("");
      setViews("");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="container">
      <h1>Pastebin Lite</h1>

      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Enter your paste text here..."
          rows="10"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <input
          type="number"
          placeholder="TTL (seconds, optional)"
          min="1"
          value={ttl}
          onChange={(e) => setTtl(e.target.value)}
        />

        <input
          type="number"
          placeholder="Max views (optional)"
          min="1"
          value={views}
          onChange={(e) => setViews(e.target.value)}
        />

        <button type="submit">Create Paste</button>
      </form>

      {resultUrl && (
        <p className="success">
          Share link:{" "}
          <a href={resultUrl} target="_blank" rel="noreferrer">
            {resultUrl}
          </a>
        </p>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
}
