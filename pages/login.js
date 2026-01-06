import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("Authenticating...");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    setMsg(data.message || "Unknown response");
    
    if (res.ok) {
      // Redirect to dashboard on success
      setTimeout(() => router.push("/dashboard"), 1000);
    }
  }

  return (
    <div className="panel" style={{ maxWidth: "520px" }}>
      <div className="panel-header">
        <div className="panel-title-block">
          <span className="panel-eyebrow">AUTHENTICATION</span>
          <h1 className="panel-title">Agent Login</h1>
          <p className="panel-subtitle">
            Access the SCP Entity Tracking Portal with your Foundation credentials
          </p>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Credentials</h3>
          <span className="card-tag">CLEARANCE CHECK</span>
        </div>
        
        <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
          <label>
            Email Address
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="agent@scp.foundation"
              required
              autoComplete="email"
            />
          </label>
          
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
          </label>
          
          <button type="submit" style={{ width: "100%", marginTop: "0.5rem" }}>
            Authenticate
          </button>
        </form>

        {msg && (
          <div style={{ 
            marginTop: "1rem", 
            padding: "0.7rem", 
            background: msg.includes("successful") ? "rgba(0,255,195,0.1)" : "rgba(255,46,46,0.1)",
            borderRadius: "8px",
            border: `1px solid ${msg.includes("successful") ? "rgba(0,255,195,0.3)" : "rgba(255,46,46,0.3)"}`,
            fontSize: "0.82rem"
          }}>
            <strong>System Response:</strong> {msg}
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <div className="card-header">
          <h3 className="card-title">Intelligence Notes</h3>
          <span className="card-tag">RECON</span>
        </div>
        <div style={{ fontSize: "0.82rem", lineHeight: "1.6" }}>
          <div className="text-muted" style={{ marginBottom: "0.6rem" }}>
            <span style={{ color: "#ff6b6b" }}>▸</span> Known admin account:{" "}
            <code style={{ color: "#00ffc3" }}>dr.bright@scp.foundation</code>
          </div>
          <div className="text-muted" style={{ marginBottom: "0.6rem" }}>
            <span style={{ color: "#ff6b6b" }}>▸</span> Password logic includes unusual hash comparison (check API source)
          </div>
          <div className="text-muted" style={{ marginBottom: "0.6rem" }}>
            <span style={{ color: "#ff6b6b" }}>▸</span> JWT tokens are stored in cookies and accessible via JavaScript
          </div>
          <div className="text-muted">
            <span style={{ color: "#ff6b6b" }}>▸</span> Consider timing attacks or email enumeration for reconnaissance
          </div>
        </div>
      </div>

      <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.85rem" }}>
        <span className="text-muted">No credentials? </span>
        <a href="/signup">Register as new agent →</a>
        <span className="text-muted" style={{ margin: "0 0.8rem" }}>|</span>
        <a href="/">← Back to briefing</a>
      </div>
    </div>
  );
}
