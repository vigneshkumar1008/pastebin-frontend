import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE } from "../config";

export default function ViewPaste() {
  const { id } = useParams();
  const [paste, setPaste] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPaste() {
      try {
        const res = await fetch(`${API_BASE}/pastes/${id}`);
        if (!res.ok) {
          throw new Error("Paste not found or expired");
        }
        const data = await res.json();
        setPaste(data);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchPaste();
  }, [id]);

  if (error) {
    return <h2 style={{ textAlign: "center" }}>{error}</h2>;
  }

  if (!paste) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  return (
    <div className="container">
      <h2>Paste Content</h2>

      <pre className="paste-box">{paste.content}</pre>

      {paste.remaining_views !== null && (
        <p>Remaining views: {paste.remaining_views}</p>
      )}

      {paste.expires_at && (
        <p>
          Expires at: {new Date(paste.expires_at).toLocaleString()}
        </p>
      )}
    </div>
  );
}
