import { useState } from "react";
import { useRouter } from "next/router";

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("Creating account...");
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    setMsg(data.message || "Unknown response");
    
    if (res.ok || res.status === 201) {
      // Redirect to dashboard on success
      setTimeout(() => router.push("/dashboard"), 1000);
    }
  }

  return (
    <div className="panel" style={{ maxWidth: "520px" }}>
      <div className="panel-header">
        <div className="panel-title-block">
          <span className="panel-eyebrow">REGISTRATION</span>
          <h1 className="panel-title">New Agent Signup</h1>
          <p className="panel-subtitle">
            Register as a field agent to access the Entity Tracking Portal
          </p>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Agent Details</h3>
          <span className="card-tag">CLEARANCE: LEVEL 1</span>
        </div>
        
        <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
          <label>
            Email Address
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="newagent@scp.foundation"
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
              placeholder="Minimum 4 characters (intentionally weak)"
              required
              autoComplete="new-password"
            />
          </label>
          
          <div className="text-muted text-small" style={{ marginBottom: "0.8rem" }}>
            ⚠️ Password requirements are intentionally lax for CTF purposes. Minimum 4 characters accepted.
          </div>
          
          <button type="submit" style={{ width: "100%", marginTop: "0.3rem" }}>
            Create Account
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
          <h3 className="card-title">Registration Info</h3>
          <span className="card-tag">INFO</span>
        </div>
        <div style={{ fontSize: "0.82rem", lineHeight: "1.6" }}>
          <div className="text-muted">
            New accounts are created with standard agent privileges. Account creation is immediate upon successful registration.
          </div>
        </div>
      </div>

      <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.85rem" }}>
        <span className="text-muted">Already registered? </span>
        <a href="/login">Login here →</a>
        <span className="text-muted" style={{ margin: "0 0.8rem" }}>|</span>
        <a href="/">← Back to briefing</a>
      </div>
    </div>
  );
}
